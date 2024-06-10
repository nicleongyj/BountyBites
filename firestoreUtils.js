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
    const collectionRef = collection(FIREBASE_DB, "f&b");

    // Get the snapshot of the collection
    const collectionSnap = await getDocs(collectionRef);

    // Map each document into its data and fetch items for each restaurant
    const restaurants = await Promise.all(collectionSnap.docs.map(async doc => {
      const restaurant = doc.data();
      const items = await fetchFoodItems(doc.id);
      console.log(items)
      return {
        ...restaurant,
        items,
      };
    }));

    // Return the data
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

export const storeFoodData = async (userId, foodData) => {
  try {
    const docRef = doc(FIREBASE_DB, "food-today", userId);
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
    const docRef = doc(FIREBASE_DB, "food-today", userId);
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
