import { FIREBASE_STORAGE } from "./FirebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";



const uriToBlob = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
};
  
export const uploadFoodPhoto = async (image) => {
    try {
        console.log("Uploading photo...");
        
        // Convert the URI to Blob
        const blob = await uriToBlob(image);
        
        const storageRef = ref(FIREBASE_STORAGE, `foodImages/${Date.now()}-${image.split('/').pop()}`);

        const snapshot = await uploadBytes(storageRef, blob);
        
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Image uploaded successfully: ", downloadURL)
        return downloadURL;
    } catch (error) {
        console.error('Error uploading a blob or file:', error);
        return null;
    }
}

export const uploadRestaurantPhoto = async (image, userId) => {
    try {
        console.log("Uploading photo...");
        
        // Convert the URI to Blob
        const blob = await uriToBlob(image);
        
        // Create a reference to the storage
        const storageRef = ref(FIREBASE_STORAGE, `restaurantLogos/${userId}`);
                
        const snapshot = await uploadBytes(storageRef, blob);
        
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading a blob or file:', error);
        return null;
    }
}