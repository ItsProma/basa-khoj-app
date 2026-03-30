import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDPy2GGPYuMdUOOf7n3_P5iufG5e3DSz4E",
  authDomain: "basa-khoj-app.firebaseapp.com",
  projectId: "basa-khoj-app",
  storageBucket: "basa-khoj-app.firebasestorage.app",
  messagingSenderId: "1021268527504",
  appId: "1:1021268527504:web:c21f4a7a5d5764c9044b15",
  measurementId: "G-JBKKEQN2KT"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();
