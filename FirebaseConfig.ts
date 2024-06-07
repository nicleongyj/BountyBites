import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyDU8VHv6HllOxYfsPmdMlShXKotObFhjNg",
  authDomain: "bountybites-ea2bf.firebaseapp.com",
  projectId: "bountybites-ea2bf",
  storageBucket: "bountybites-ea2bf.appspot.com",
  messagingSenderId: "1055896319485",
  appId: "1:1055896319485:web:c4ddaafe91c97e558e1594"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);

// Auth provider for Firebase
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

// Firestore provider for Firebase
export const FIREBASE_DB = getFirestore(FIREBASE_APP);