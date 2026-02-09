import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// These are your exact keys from the studyhub-final-d0c27 project
const firebaseConfig = {
  apiKey: "AIzaSyBD-45Q-htxoBl4LbxGZdv4WzGXdXP-_qI",
  authDomain: "studyhub-final-d0c27.firebaseapp.com",
  projectId: "studyhub-final-d0c27",
  storageBucket: "studyhub-final-d0c27.firebasestorage.app",
  messagingSenderId: "957017752899",
  appId: "1:957017752899:web:7c8d35ad5639937ea29bf6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the database and storage for use in your Dashboard
export const db = getFirestore(app);      
export const storage = getStorage(app);