import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { IChat, IChatHeader, IMessage } from "../interfaces";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { ChatContext, ChatType } from "../context/ChatContext";
import { ChatHeaderType, InputState, TRegisterState, TUseFormManagement, TUseMessagesManagement } from "../types";
import { removeMessageFromUnreaded } from "../firebase/chat";

const l = (mes : any, title : string = "DEBUG hooks") => console.log(title, mes); 

export function useChats() : Array<IChatHeader>{
    const l = (mes : any, title : string = "DEBUG useChats hook: ") => console.log(title, mes); 
    const currentUser = useContext(AuthContext);
    const [chats, setChats] = useState<IChatHeader[]>([]);


    useEffect(function(){
        const getChats = function(){
            l(currentUser.uid);
            const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
                const result = doc.exists() 
                ? 
                Object.entries(doc.data()).map(chat => ({
                    "uid": chat[0], 
                    "userInfo" : chat[1].userInfo, 
                    "dateCreated": chat[1].date, 
                    "lastMessage": chat[1].lastMessage,
                    //"lastMessageDate": chat[1]?.lastMessageDate,
                    "unreadedMessages" : chat[1]?.unreadedMessages
                })) 
                : 
                [];

                // if(result.length > 0) setChats(result);
                setChats(result);
                
                l("Received chats: " + result.length);
            });

            return () =>{
                unsub()
            }
        }

        currentUser.uid && getChats();
    },[currentUser.uid])

    return chats;
}
/**
 * Define last message once related message object from all messages has been deleted
 */
export function useLastMessageManagement(currentMessageSet : IMessage[]){
    const [lastMessage, setLastMessage] = useState();

    // useEffect(() => {
    //     currentMessageSet
    // }, [lastMessage]);

    return {lastMessage, setLastMessage};
}

export function useChatHeader(currentChat : IChat, chatHeaderType : ChatHeaderType) : IChatHeader | undefined{
    //const {currentChat} = useContext(ChatContext);
    // const defaultChatHeader : IChatHeader = {
    //     uid: "",
    //     userInfo: {
    //         name: "",
    //         photoURL: "",
    //         uid: ""
    //     },
    //     lastMessage: "",
    //     date: new Date()
    // }

    const [friendChatHeader, setFriendChatHeader] = useState<IChatHeader>();
    const chatHeaderID = chatHeaderType == ChatHeaderType.friend ? currentChat.user.uid : currentChat.chatID.replace(currentChat.user.uid, "");
    
    useEffect(() => {
        const getFrinedChatHeader = function(){
            const unsub = onSnapshot(doc(db, "userChats", chatHeaderID), (document) => {
                const response = document.exists() && 
                document.data()[currentChat.chatID];
                setFriendChatHeader({
                    uid: chatHeaderID,
                    ...response
                });
            });

            return () => {
                unsub();
            }
        }

        chatHeaderID && getFrinedChatHeader();
    }, [currentChat.user.uid])

    return friendChatHeader;
}

export function getCombinedChatID(currentUserID : string, friendID : string){
    return currentUserID > friendID 
            ? currentUserID + friendID 
            : friendID + currentUserID;
}

export function useModalElement(){
    const modalRootElement = document.getElementById("modal");

    const element = useMemo(() => {
        const el = document.createElement("div");
        return el;
    }, []);
    useEffect(() => {
        modalRootElement?.appendChild(element);
        return () =>{
            modalRootElement?.removeChild(element);
        }
    }, [])

    return element;
}

function clearLocalStorage(){
    localStorage.clear();
}

export function useStoredChatFiles({inputText, setInputText} : {inputText : string, setInputText : Dispatch<SetStateAction<string>>}){

    const {currentChat} = useContext(ChatContext);
    const delay = 800;
    
    // const getStoredChatFils = () => {
    //     if(!chat?.currentChat?.chatID && !localStorage.getItem(chat?.currentChat?.chatID!)) return;
    //     console.log(JSON.parse(localStorage.getItem(chat?.currentChat?.chatID!)!));
    //     //setState(JSON.parse(localStorage.getItem(chat?.currentChat?.chatID!)!) as InputState);
    // }
    // console.log("TEST useStoredChatFiles");
    // getStoredChatFils();
    function saveFilesLocaly(){
        if(!currentChat.chatID) return;
        // console.log(JSON.stringify(newState));
        localStorage.setItem(currentChat?.chatID, inputText)
    }
    useEffect(() => {
        if(!currentChat?.chatID) return;
        
        const storedFiles = localStorage.getItem(currentChat.chatID);

        if(storedFiles) setInputText(JSON.parse(storedFiles))
        // if(!storedFiles) setState(defaultValue);
        // else setState(JSON.parse(storedFiles));

    }, [currentChat.chatID])

    useEffect(() => {
        const handler = setTimeout(() => saveFilesLocaly(), delay);
        return () => clearTimeout(handler);
    }, [inputText, delay])

}


export function useLocalStorageClearing(){
    useEffect(() => {
        const clearAllCache = () => {
            localStorage.clear();
        }
        return () => {
            console.log("ALL Clear");
            clearAllCache()
        }
    }, [])
}

// export function useDebounce(value : string, delay : number = 300){
//     const [debounced, setDebounced] = useState(value);
    
//     useEffect(() => {
//         const handler = setTimeout(() => setDebounced(value), delay);
//         return () => clearTimeout(handler);
//     }, [value, delay])

//     return debounced
// }

