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
    const { food, endTime } = foodData;

    const docRef = doc(FIREBASE_DB, "food-today", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Document exists, update it
      await updateDoc(docRef, {
        foodItems: arrayUnion(food),
      });
    } else {
      // Document doesn't exist, create it
      await setDoc(docRef, {
        endTime: endTime,
        foodItems: [foodData],
      });
    }

    console.log("Food data stored successfully for user: ", userId);
  } catch (error) {
    console.error("Error storing food data: ", error);
    throw error;
  }
};
