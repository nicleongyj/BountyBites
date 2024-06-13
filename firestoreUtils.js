// firestoreUtils.js
import {
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { FIREBASE_DB } from "./FirebaseConfig";

export const fetchRestaurantData = async (userId) => {
  try {
    const docRef = doc(FIREBASE_DB, "f&b", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No restaurant data found for this user.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching restaurant data: ", error);
    return null; 
  }
};

export const fetchAllRestaurants = async () => {
  try {
    const today = getTodayAsString();
    const collectionRef = collection(FIREBASE_DB, "f&b");
    const collectionSnap = await getDocs(collectionRef);
    const restaurants = await Promise.all(
      collectionSnap.docs.map(async (doc) => {
        const restaurant = doc.data();
        const items = await fetchFoodItems(doc.id);
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
      })
    );
    return restaurants;
  } catch (error) {
    console.error("Error fetching all restaurants:", error);
    return null; // Return null in case of error
  }
};

export const storeRestaurantData = async (restaurantData) => {
  try {
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
    await updateAnalytics(userId, -1 * foodItems[index].quantity);
    return updatedItems;
  } catch (error) {
    console.error("Error deleting food item: ", error);
    throw error;
  }
};

export const getTodayAsString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

export const storeFoodData = async (userId, foodData) => {
  try {
    const today = getTodayAsString();
    const docRef = doc(FIREBASE_DB, today, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        foodItems: arrayUnion(foodData),
      });
    } else {
      await setDoc(docRef, {
        foodItems: [foodData],
      });
    }
    await updateAnalytics(userId, foodData.quantity);
    console.log("Food data stored successfully for user: ", userId);
  } catch (error) {
    console.error("Error storing food data: ", error);
    throw error;
  }
};

export const getRestaurantDataFromFoodToday = async () => {
  const restaurantDataArray = []; 

  try {
    const foodTodaySnapshot = await getDocs(
      collection(FIREBASE_DB, "food-today")
    );

    for (const doc of foodTodaySnapshot.docs) {
      const userId = doc.id; 
      const restaurantSnapshot = await getDoc(doc(FIREBASE_DB, "f&b", userId));
      if (restaurantSnapshot.exists()) {
        const restaurantData = restaurantSnapshot.data(); 
        restaurantDataArray.push({ [userId]: restaurantData });
      } else {
        console.log("No restaurant data found for userId:", userId);
      }
    }
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
        id: `${userId}-${index}`,
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
    console.log("Updating analytics for restaurant: ", restaurantId);
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; 
    const year = today.getFullYear();

    const docRef = doc(FIREBASE_DB, "analytics", restaurantId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data[year]) {
        if (data[year][month]) {
          if (data[year][month][day]) {
            await updateDoc(docRef, {
              [`${year}.${month}.${day}`]: data[year][month][day] + quantity,
            });
          } else {
            await updateDoc(docRef, { [`${year}.${month}.${day}`]: quantity });
          }
          await updateDoc(docRef, {
            [`${year}.${month}.counter`]:
              (data[year][month].counter || 0) + quantity,
          });
        } else {
          await updateDoc(docRef, {
            [`${year}.${month}`]: { [day]: quantity, counter: quantity },
          });
        }
        await updateDoc(docRef, {
          [`${year}.counter`]: (data[year].counter || 0) + quantity,
        });
      } else {
        await setDoc(docRef, {
          [year]: {
            [month]: { [day]: quantity, counter: quantity },
            counter: quantity,
          },
        });
      }
    } else {
      await setDoc(docRef, {
        [year]: {
          [month]: { [day]: quantity, counter: quantity },
          counter: quantity,
        },
      });
    }
  } catch (error) {
    console.error("Error updating analytics: ", error);
    throw error;
  }
};

export const retrieveMonthlyAnalytics = async (restaurantId) => {
  try {
    console.log("Retrieving this month's analytics: " + restaurantId);
    const today = new Date();
    const month = today.getMonth() + 1; 
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
          dailyCounters[day] = currentMonth[day] || 0; 
        }
        dailyCounters["counter"] = monthlyCounter;
        dailyCounters["prevCounter"] = prevMonthlyCounter;
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
    console.log("Retrieving this year's analytics");
    const today = new Date();
    const year = today.getFullYear();

    const docRef = doc(FIREBASE_DB, "analytics", restaurantId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data[year]) {
        const monthlyCounters = {};
        const yearlyCounter = data[year].counter || 0;
        for (let month = 1; month <= 12; month++) {
          monthlyCounters[month] = data[year][month]?.counter || 0;
        }
        monthlyCounters["counter"] = yearlyCounter;
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
    return null;
  }
};
