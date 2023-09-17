// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeApp } from "firebase/app";

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

