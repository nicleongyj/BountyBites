// firestoreUtils.js
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_DB } from "./FirebaseConfig";

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
