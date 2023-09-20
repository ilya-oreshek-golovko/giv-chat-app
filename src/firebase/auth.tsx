import {signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword} from "firebase/auth";
import { auth, db } from './firebase';
import {push, ref, set, get, query} from 'firebase/database';
import { IUser } from "../interfaces";

export const logInWithEmailAndPassword = async (email : string, password : string) => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (err  : any) {
      return err.message;
    }
};

export const logout = () => {
    signOut(auth);
};

export const registerWithEmailAndPassword = async (email : string,  password : string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log(res);
      return res;
    } catch (err : any) {
      console.error(err);
      alert(err.message);
    }
};

export async function addUser(user : IUser){
  const oRef = await push(
    ref(db, "users")
  );

  await set(oRef, user);
  // const oSnapshot = await get(query(oRef));

  // return oSnapshot.val();
}

// export const sendPasswordReset = async (email : string) => {
//     try {
//       await sendPasswordResetEmail(auth, email);
//       alert("Password reset link sent!");
//     } catch (err  : any) {
//       console.error(err);
//       alert(err.message);
//     }
// };

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

// export const uploadFileTest = (file : File) => {
//   const storage = getStorage();
//   const storageRef = refStore(storage, 'profile');

//   // 'file' comes from the Blob or File API
//   uploadBytes(storageRef, file).then((snapshot) => {
//     console.log('Uploaded a blob or file!');
//     console.log(snapshot);
//   });
// }