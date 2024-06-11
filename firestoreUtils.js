// firestoreUtils.js
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { FIREBASE_DB } from "./FirebaseConfig";

export const fetchRestaurantData = async (userId) => {
  try {
    // Get the document reference for the user's restaurant data
    const docRef = doc(FIREBASE_DB, "f&b", userId);

    // Get the snapshot of the document
    const docSnap = await getDoc(docRef);

    // Check if the document exists
    if (docSnap.exists()) {
      // Return the data if the document exists
      return docSnap.data();
    } else {
      console.log("No restaurant data found for this user.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching restaurant data: ", error);
    return null; // Return null in case of error
  }
};



export const fetchAllRestaurants = async () => {
  try {
    // Get the collection reference for the restaurants
    const today = getTodayAsString();
    const collectionRef = collection(FIREBASE_DB, "f&b");

    // Get the snapshot of the collection
    const collectionSnap = await getDocs(collectionRef);

    // Map each document into its data and fetch items for each restaurant
    const restaurants = await Promise.all(collectionSnap.docs.map(async doc => {
      const restaurant = doc.data();
      const items = await fetchFoodItems(doc.id);

      // Calculate the maximum discount for the restaurant
      let discount = 0;
      if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].discount && items[i].discount > discount) {
            discount = items[i].discount;
          }
        }
      }

      let totalQuantity = 0;
      if (items && items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          totalQuantity += items[i].currentQuantity;
        }
      }


      const result = {
        ...restaurant,
        items,
        discount,
        totalQuantity,
      };
      return result;
    }));
    return restaurants;
  } catch (error) {
    console.error("Error fetching all restaurants:", error);
    return null; // Return null in case of error
  }
};

export const storeRestaurantData = async (restaurantData) => {
  try {
    // Create a new document in the "restaurants" collection
    const docRef = doc(FIREBASE_DB, "f&b", restaurantData.userId);

    await setDoc(docRef, {
      ...restaurantData,
    });

    console.log("Restaurant data stored with ID: ", docRef.id);
  } catch (error) {
    console.error("Error storing restaurant data: ", error);
    throw error;
  }
};

export const deleteFoodItem = async (index, foodItems, userId) => { 
  try {
      const today = getTodayAsString();
      const updatedItems = foodItems.filter((_, i) => i !== index);
      const docRef = doc(FIREBASE_DB, today, userId);
      await updateDoc(docRef, { foodItems: updatedItems });
      await updateAnalytics(userId, -1 * foodItems[index].quantity)
      return updatedItems

  } catch (error) {
      console.error("Error deleting food item: ", error);
      throw error
  }
};

const getTodayAsString = () => {
  const today = new Date();
  // today.setDate(today.getDate()-1);
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};


export const storeFoodData = async (userId, foodData) => {
  try {
    const today = getTodayAsString();
    const docRef = doc(FIREBASE_DB, today, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Document exists, update it
      await updateDoc(docRef, {
        foodItems: arrayUnion(foodData),
      });
    } else {
      // Document doesn't exist, create it
      await setDoc(docRef, {
        foodItems: [foodData],
      });
    }
    await updateAnalytics(userId, foodData.quantity)
    console.log("Food data stored successfully for user: ", userId);
  } catch (error) {
    console.error("Error storing food data: ", error);
    throw error;
  }
};


export const getRestaurantDataFromFoodToday = async () => {
  const restaurantDataArray = []; // Array to store restaurant data

  try {
    // Query the "food-today" collection
    const foodTodaySnapshot = await getDocs(
      collection(FIREBASE_DB, "food-today")
    );

    // Iterate over each document in the "food-today" collection
    for (const doc of foodTodaySnapshot.docs) {
      const userId = doc.id; // Get the userId from the document ID

      // Query the "f&b" collection to get the restaurant data
      const restaurantSnapshot = await getDoc(doc(FIREBASE_DB, "f&b", userId));

      // Check if the restaurant data exists
      if (restaurantSnapshot.exists()) {
        const restaurantData = restaurantSnapshot.data();
        // Add restaurant data to the array as a dictionary with userId as the key
        restaurantDataArray.push({ [userId]: restaurantData });
      } else {
        console.log("No restaurant data found for userId:", userId);
      }
    }

    // Log the array of restaurant data
    console.log("Restaurant Data Array:", restaurantDataArray);
  } catch (error) {
    console.error("Error getting restaurant data from food-today:", error);
  }

  return restaurantDataArray; // Return the array of restaurant data
};

export const fetchFoodItems = async (userId) => {
  try {
    const today = getTodayAsString();
    const docRef = doc(FIREBASE_DB, today, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const foodItemsArray = docSnap.data().foodItems;
      return foodItemsArray.map((foodItem, index) => ({
        id: `${userId}-${index}`, // Unique key for each food item
        ...foodItem,
      }));
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching food items: ", error);
  }
};



export const updateAnalytics = async (restaurantId, quantity) => {
  try {
    console.log("Updating analytics for restaurant: ", restaurantId )
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // JavaScript months are 0-indexed
    const year = today.getFullYear();

    const docRef = doc(FIREBASE_DB, "analytics", restaurantId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Document exists, update it
      const data = docSnap.data();
      if (data[year]) {
        if (data[year][month]) {
          if (data[year][month][day]) {
            // Day field exists, update it
            await updateDoc(docRef, { [`${year}.${month}.${day}`]: data[year][month][day] + quantity });
          } else {
            // Day field doesn't exist, create it
            await updateDoc(docRef, { [`${year}.${month}.${day}`]: quantity });
          }
          // Update the monthly counter
          await updateDoc(docRef, { [`${year}.${month}.counter`]: (data[year][month].counter || 0) + quantity });
        } else {
          // Month field doesn't exist, create it
          await updateDoc(docRef, { [`${year}.${month}`]: { [day]: quantity, counter: quantity } });
        }
        // Update the yearly counter
        await updateDoc(docRef, { [`${year}.counter`]: (data[year].counter || 0) + quantity });
      } else {
        // Year field doesn't exist, create it
        await setDoc(docRef, { [year]: { [month]: { [day]: quantity, counter: quantity }, counter: quantity } });
      }
    } else {
      // Document doesn't exist, create it
      await setDoc(docRef, { [year]: { [month]: { [day]: quantity, counter: quantity }, counter: quantity } });
      console.log("Document created for restaurant: ", restaurantId)
    }

    console.log("Analytics updated successfully for restaurant: ", restaurantId);
  } catch (error) {
    console.error("Error updating analytics: ", error);
    throw error;
  }
};

export const retrieveMonthlyAnalytics = async (restaurantId) => {
  try {
    console.log("Retrieving this month's analytics: " + restaurantId)
    const today = new Date();
    const month = today.getMonth() + 1; // JavaScript months are 0-indexed
    const year = today.getFullYear();

    const docRef = doc(FIREBASE_DB, "analytics", restaurantId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data[year] && data[year][month]) {
        const monthlyCounter = data[year][month].counter || 0;
        const prevMonthlyCounter = data[year][month - 1].counter || 0;
        const dailyCounters = {};
        const currentMonth = data[year][month] || {};
        for (let day = 1; day <= today.getDate(); day++) {
          dailyCounters[day] = currentMonth[day] || 0; // Get the value directly
        }
        dailyCounters["counter"] = monthlyCounter
        dailyCounters["prevCounter"] = prevMonthlyCounter
        return dailyCounters;
      } else {
        console.log("No analytics data found for this month.");
        return null;
      }
    } else {
      console.log("No analytics data found for this restaurant.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving monthly analytics: ", error);
    return null; // Return null in case of error
  }
};

export const retrieveYearlyAnalytics = async (restaurantId) => {
  try {
    console.log("Retrieving this year's analytics")
    const today = new Date();
    const year = today.getFullYear();

    const docRef = doc(FIREBASE_DB, "analytics", restaurantId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data[year]) {
        // Retrieve the yearly counter
        const monthlyCounters = {};
        const yearlyCounter = data[year].counter || 0;
        for (let month = 1; month <= 12; month++) {
          monthlyCounters[month] = data[year][month]?.counter || 0;
        }
        monthlyCounters["counter"] = yearlyCounter
        return monthlyCounters;
      } else {
        console.log("No analytics data found for this year.");
        return null;
      }
    } else {
      console.log("No analytics data found for this restaurant.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving yearly analytics: ", error);
    return null; // Return null in case of error
  }
};