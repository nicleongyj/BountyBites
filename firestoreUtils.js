// firestoreUtils.js
import { doc, setDoc, getDoc } from "firebase/firestore";
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
    const { userId, username, location, restaurantName, latitude, longitude } =
      restaurantData;

    // Check if latitude and longitude are within valid range
    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new Error("Invalid latitude or longitude");
    }

    // Create a new document in the "restaurants" collection
    const docRef = doc(FIREBASE_DB, "f&b", userId);

    await setDoc(docRef, {
      username,
      location,
      restaurantName,
      latitude,
      longitude,
    });

    console.log("Restaurant data stored with ID: ", docRef.id);
  } catch (error) {
    console.error("Error storing restaurant data: ", error);
    throw error;
  }
};
