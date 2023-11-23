import { arrayUnion, deleteField, doc, getDoc, setDoc, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import { IMessage, IChats, IUserChats, IChatHeader } from "../interfaces";

export async function createChatHeader(userUID : string, userChats : IUserChats){
    await setDoc(doc(db, "userChats", userUID), userChats);
} 
// export async function updateChatHeader(userUID : string, chatID : string, lastMessage : string/*userChats : IUserChats*/){
//     await updateDoc(doc(db, "userChats", userUID), {
//         [`${chatID}.lastMessage`] : lastMessage
//     });
// }
export async function updateMultipleChatHeaders(chatHeadersDate : Array<any>){
    const batch = writeBatch(db);

    for(const chatHeader of chatHeadersDate){
        batch.update(doc(db, "userChats", chatHeader.headerID), chatHeader.headerContent);
    }
    // Commit the batch
    await batch.commit();
}
export async function updateChatHeader(headerID : string, headerData : any){
    console.log("headerData");
    console.log(headerData);
    await updateDoc(doc(db, "userChats", headerID), headerData);
}

export async function getChatHeader(headerID : string) : Promise<any>{
    const response = await getDoc(doc(db, "userChats", headerID));
    return response.data();
}

export async function removeChatHeader(chatHeaderID : string, chatID : string){
    await updateDoc(doc(db, "userChats", chatHeaderID), {
        [`${chatID}`] : deleteField()
    });
    return true;
}

export async function getChat(chatID : string){
    const response = await getDoc(doc(db, "chats", chatID));
    return response;
}
export async function createChat(chatID : string, chat : IChats){
    const response = await setDoc(doc(db, "chats", chatID), chat);
    return response;
}
//, newUnreadedMessage : IUnreadedMessages
export async function addMessageToChat(newMessage : IMessage, chatID : string){
    // const messages : IChats = { // should be IMessages
    //     messages : arrayUnion(message),
    //     unreaded: []
    // };
    await updateDoc(doc(db, "chats", chatID), { 
        messages : arrayUnion(newMessage)
    });
}

// export async function markMessagesAsReaded(chatID : string){
//     const batch = writeBatch(db);

//     batch.set(doc(db, "chats", chatID), {
//         messages: "New York City"
//     });
    
//     // Update the population of 'SF'
//     const sfRef = doc(db, "cities", "SF");
//     batch.update(sfRef, {"population": 1000000});
    
//     // Delete the city 'LA'
//     const laRef = doc(db, "cities", "LA");
//     batch.delete(laRef);
    
//     // Commit the batch
//     await batch.commit();
// }

export async function clearUnreadedMessages(chatHeaderID : string, chatID : string){
    console.log(chatHeaderID);
    await updateDoc(doc(db, "userChats", chatHeaderID), {
        [`${chatID}.unreadedMessages`] : deleteField()
    });
}

export async function removeMessageFromUnreaded(chatHeaderID : string, chatID : string, messageIDToDelete : string, allUnreadedMessages : Array<string>){
    const newUnreadedMessages = allUnreadedMessages.filter(unreadedMessageID => unreadedMessageID !== messageIDToDelete);
    await updateDoc(doc(db, "userChats", chatHeaderID), {
        [`${chatID}.unreadedMessages`] : newUnreadedMessages
    });
}

export async function updateMessagesList(chatID : string, newMessages : Array<IMessage>){
    await updateDoc(doc(db, "chats", chatID), { 
        messages : newMessages
    });
}
export async function removeChatMessages(chatID : string){
    await updateDoc(doc(db, "chats", chatID), { 
        messages : deleteField()
    });
}
