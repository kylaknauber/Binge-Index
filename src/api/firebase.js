// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: "binge-index-kjk.firebaseapp.com",
    projectId: "binge-index-kjk",
    storageBucket: "binge-index-kjk.firebasestorage.app",
    messagingSenderId: "880282507787",
    appId: "1:880282507787:web:f3a39aa3def36fd116450e",
    measurementId: "G-JZKZTDQZ1W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;