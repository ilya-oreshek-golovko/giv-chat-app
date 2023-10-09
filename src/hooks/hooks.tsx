import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { IChatHeader, IMessage } from "../interfaces";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { ChatContext } from "../context/ChatContext";

export function useChats(){
    const l = (mes : any, title : string = "DEBUG useChats hook: ") => console.log(title, mes); 
    const currentUser = useContext(AuthContext);
    const [chats, setChats] = useState<IChatHeader[]>();


    useEffect(function(){
        const getChats = function(){
            l(currentUser.uid);
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                const result = doc.exists() ? Object.entries(doc.data()).map(chat => ({"uid": chat[0], "userInfo" : chat[1].userInfo, "date": chat[1].date})) : undefined;
                setChats(result);
                l("Received chats: " + result);
            });

            return () =>{
                unsub()
            }
        }

        currentUser.uid && getChats();
    },[currentUser.uid])

    return chats;
}

export function useMessages(){
    const chat = useContext(ChatContext);
    const [messages, setMessages] = useState<IMessage[] | undefined>();

    useEffect(() => {

        const getMessages = () => {
            onSnapshot(doc(db, "chats", chat?.currentChat?.chatID!), (document) => {
                const response = document.exists() && 
                document.data()["messages"]
                ?.map((message : IMessage) => ({ 
                    senderID: message.senderID,
                    text: message.text,
                    img: message.img,
                    id: message.id,
                    date: message.date
                }));

                setMessages(response);
            });
        } 

        chat?.currentChat?.chatID && getMessages();
    }, [chat?.currentChat?.chatID])

    return messages || [];
}

export function getCombinedChatID(currentUserID : string, friendID : string){
    return currentUserID > friendID 
            ? currentUserID + friendID 
            : friendID + currentUserID;
}