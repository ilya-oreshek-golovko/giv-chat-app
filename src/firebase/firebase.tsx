import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAd9kHMi5l-Fc-gNeKQ-P7SwgK_3TrVts",
  authDomain: "todos-943dd.firebaseapp.com",
  databaseURL: "https://todos-943dd-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "todos-943dd",
  storageBucket: "todos-943dd.appspot.com",
  messagingSenderId: "426741108490",
  appId: "1:426741108490:web:519a8486fa1f605359f4f3"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
export const db = getDatabase(firebaseApp);//getFirestore(firebaseApp);

