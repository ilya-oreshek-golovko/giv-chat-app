import {firebaseApp} from './firebase';
import {signInWithEmailAndPassword, signOut, getAuth, sendPasswordResetEmail, createUserWithEmailAndPassword} from "firebase/auth";
import { getDatabase, ref as refDb, push, set, get, query, remove } from "firebase/database"
import { IUser } from '../interfaces';
import {getStorage, ref as refStore, uploadBytes} from 'firebase/storage';

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

// export const addUser = async ( user : IUser) => {
//   try{
//     const oRef = await push(
//       ref(
//         getDatabase(),
//         `users/`
//       )
//     );
//   }catch(error : any){
//     return error.message;
//   }
// }

export const uploadFileTest = (file : File) => {
  const storage = getStorage();
  const storageRef = refStore(storage, 'profile');

  // 'file' comes from the Blob or File API
  uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded a blob or file!');
    console.log(snapshot);
  });
}