import {firebaseApp} from './firebase';
import {signInWithEmailAndPassword, signOut, getAuth, sendPasswordResetEmail, createUserWithEmailAndPassword} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import {connectAuthEmulator } from "firebase/auth";

async function checkNetworkConnectivity() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener("error", () => reject("Network Error"));
      xhr.addEventListener("timeout", () => reject("Request Timed Out"));
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.statusText);
        }
      });
      xhr.open("GET", "https://www.google.com");
      xhr.send();
    });
  }

export const logInWithEmailAndPassword = async (email : string, password : string) => {
    try {
      const user = await signInWithEmailAndPassword(getAuth(firebaseApp), email, password);
      return user;
    } catch (err  : any) {
      return err.message;
    }
};

export const logout = () => {
    signOut(getAuth(firebaseApp));
};

export const registerWithEmailAndPassword = async (email : string,  password : string) => {
    try {
      const res = await createUserWithEmailAndPassword(getAuth(firebaseApp), email, password);
      const user = res.user;
      console.log(user);
      return user;
    } catch (err : any) {
      console.error(err);
      alert(err.message);
    }
};

export const sendPasswordReset = async (email : string) => {
    try {
      await sendPasswordResetEmail(getAuth(firebaseApp), email);
      alert("Password reset link sent!");
    } catch (err  : any) {
      console.error(err);
      alert(err.message);
    }
};