import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { IMessage } from "../interfaces";

export async function createUserChat(userUID : any){
    await setDoc(doc(db, "userChats", userUID), {});
} 

export async function getChat(chatID : string){
    const response = await getDoc(doc(db, "chats", chatID));
    return response;
}
export async function addMessage(message : IMessage, chatID : string){
    await updateDoc(doc(db, "chats", chatID), {
        messages : arrayUnion(message)
    });
}

export async function createChat(chatID : string){
    const response = await setDoc(doc(db, "chats", chatID), {message: []});
    return response;
}

export async function updateChatHeader(headerID : string, headerData : any){
    await updateDoc(doc(db, "userChats", headerID), headerData);
}

export async function getChatHeader(headerID : string){
    const response = await getDoc(doc(db, "userChats", headerID));
    return response.data();
}
