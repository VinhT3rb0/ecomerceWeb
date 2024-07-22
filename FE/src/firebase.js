import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCQCZrCT32DjfmB72fYgKiIp0FrcwArlgQ",
    authDomain: "e-commerce-b0d28.firebaseapp.com",
    projectId: "e-commerce-b0d28",
    storageBucket: "e-commerce-b0d28.appspot.com",
    messagingSenderId: "99107455329",
    appId: "1:99107455329:web:b79de0348eb2c79fcb0520"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
const database = getDatabase(app);

export { database };
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();