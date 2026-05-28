import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration — uses Vite env vars with project defaults as fallback.
// Firebase API keys are client-safe; security is enforced via Firestore rules.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDAkbOMWv8tf99StwhOGEK_B6nYb2hEs8g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dsa-tracker-484a1.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dsa-tracker-484a1",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dsa-tracker-484a1.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "677649567441",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:677649567441:web:2f8d44397d2cfb73547ff0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-EZCXC2E2KZ",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
