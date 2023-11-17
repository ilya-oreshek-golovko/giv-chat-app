import { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { IChatHeader, IMessage } from "../interfaces";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { ChatContext, ChatType } from "../context/ChatContext";
import { InputState, TRegisterState } from "../types";

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
                    "date": chat[1].date, 
                    "lastMessage": chat[1].lastMessage,
                    "unreadedMessages" : chat[1]?.unreadedMessages
                })) 
                : 
                [];

                if(result.length > 0) setChats(result);
                
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

export function useMessages(){
    const {currentChat} = useContext(ChatContext);
    const [messages, setMessages] = useState<IMessage[] | undefined>();

    useEffect(() => {

        const getMessages = function(){
            const unsub = onSnapshot(doc(db, "chats", currentChat.chatID), (document) => {
                const response = document.exists() && 
                document.data()["messages"]
                ?.map((message : IMessage) => ({ 
                    senderID: message.senderID,
                    text: message.text,
                    documents : message.documents,
                    images: message.images,
                    id: message.id,
                    date: message.date
                } as IMessage));
    
                setMessages(response);
            });

            return () => {
                unsub();
            }
        }

        currentChat.chatID && getMessages();
    }, [currentChat.chatID])

    return {setMessages, messages};
}

export function useFriendChatHeader(chatHeaderID : string) : IChatHeader | undefined{
    const {currentChat} = useContext(ChatContext);
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

    useEffect(() => {
        const getFrinedChatHeader = function(){
            const unsub = onSnapshot(doc(db, "userChats", chatHeaderID), (document) => {
                const response = document.exists() && 
                document.data()[currentChat.chatID];
    
                setFriendChatHeader(response);
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

export function useStoredChatFiles(chat : ChatType | undefined, delay : number = 800){
    const defaultValue = {
        text: "",
        images : [],
        documents: [],
        isSendClicked : false
    }
    const [state, setState] = useState<InputState>(defaultValue);
    // const getStoredChatFils = () => {
    //     if(!chat?.currentChat?.chatID && !localStorage.getItem(chat?.currentChat?.chatID!)) return;
    //     console.log(JSON.parse(localStorage.getItem(chat?.currentChat?.chatID!)!));
    //     //setState(JSON.parse(localStorage.getItem(chat?.currentChat?.chatID!)!) as InputState);
    // }
    // console.log("TEST useStoredChatFiles");
    // getStoredChatFils();
    function saveFilesLocaly(newState : InputState){
        if(!chat?.currentChat?.chatID) return;
        console.log(JSON.stringify(newState));
        localStorage.setItem(chat?.currentChat?.chatID, JSON.stringify(newState))
    }
    useEffect(() => {
        if(!chat?.currentChat?.chatID) return;
        
        const storedFiles = localStorage.getItem(chat?.currentChat?.chatID!);

        if(!storedFiles) setState(defaultValue);
        else setState(JSON.parse(storedFiles));

    }, [chat?.currentChat?.chatID])

    useEffect(() => {
        const handler = setTimeout(() => saveFilesLocaly(state), delay);
        return () => clearTimeout(handler);
    }, [state.text, state.documents, state.images, delay])

    return {state, setState};
}

export function useStoredRegisterData(){
    const localKey = "register-data";
    const defaultValue = {
        errors: {
            eEmail: "",
            eUserName: "",
            ePassword: "",
            eConfirmPassword: "",
            eProfileImg: ""
        },
        modal: {
            isOpen: false,
            children: null
        },
        input: {
            userName: "",
            email: "",
            password: "",
            confirmPass: "",
            profile: null
        }
    };
    const [state, setState] = useState<TRegisterState>(defaultValue);

    const saveRegisterData = () => {
        console.log("saveRegisterData");
        console.log(state.input.profile);
        //if(!state.input.profile) return;
        localStorage.setItem(localKey, JSON.stringify({
            ...state,
            input: {
                ...state.input,
                profile: null
            }
    }));
        // state.input.profile.arrayBuffer().then((arrayBuffer) => {
        //     console.log("arrayBuffer");
        //     // const imageBlob = new Blob([new Uint8Array(arrayBuffer)], {type:'image/jpeg'});
        //     // const storedProfile = new File([imageBlob], "test.jpeg", {
        //     //     type: "image/jpeg"
        //     // });
        //     // console.log(imageBlob);
        //     // console.log(storedProfile);
        //     //console.log(JSON.stringify([new Uint8Array(arrayBuffer)]));
        //     const serializedProfile = {
        //         array: [new Uint8Array(arrayBuffer)],
        //         type: state.input.profile!.type,
        //         name: state.input.profile!.name
        //     };
        //     localStorage.setItem(localKey, JSON.stringify({
        //         ...state,
        //         input: {
        //             ...state.input,
        //             profile: serializedProfile
        //         }
        //     }));
        // });
        
    }
    
    useEffect(() => {
        const lState = JSON.parse(localStorage.getItem(localKey)!);
        //console.log(storedFiles);
        if(!lState){
            setState(defaultValue);
        }else{
            //console.log("RESTORE");
            // console.log(lState.input.profile.array[0]);
            // const resut = [];
            // for(const el in lState.input.profile.array[0]){
            //     resut.push(lState.input.profile.array[0][el]);
            // }

            // const imageBlob = new Blob(resut, {type:'image/jpeg'});
            // const storedProfile = new File(resut, lState.input.profile.name, {
            //     type: lState.input.profile.type
            // });

            // setState({
            //     errors: lState.errors,
            //     modal: lState.modal,
            //     input : {
            //         ...lState.input,
            //         profile: null
            //     }
            // });
            setState(lState);
        }

        return () => {
            clearLocalStorage();
        }
    }, [])

    useEffect(() => {
        const handler = setTimeout(() => saveRegisterData(), 500);
        return () => clearTimeout(handler);
    }, [state.input.confirmPass, state.input.email, state.input.password, state.input.profile, state.input.userName])

    return {state, setState};
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

