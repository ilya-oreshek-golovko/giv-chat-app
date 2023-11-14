import { Dispatch, SetStateAction, createContext, useEffect, useState, useContext } from "react";
import { IChat } from "../interfaces";
import { AuthContext } from "./AuthContext";

export type ChatType = {
    currentChat : IChat,
    setCurrentChat : Dispatch<SetStateAction<IChat>>
}
const defaultContextValue = {
    currentChat: {
        chatID: "",
        unreadedMessages: [],
        user: {
            name: "",
            photoURL: "",
            uid: ""
        }
    },
    setCurrentChat: () => {}
}
export const ChatContext = createContext<ChatType>(defaultContextValue);

export function ChatContextProvider({children} : {children : any}){

    const currentUser = useContext(AuthContext);
    const [currentChat, setCurrentChat] = useState<IChat>(defaultContextValue.currentChat);

    useEffect(() => {

        const resetCurrentChat = () => {
            console.log("ChatProvider Reset");
            setCurrentChat(defaultContextValue.currentChat)
        }

        return () =>{
            resetCurrentChat()
        }
    }, [currentUser?.uid])

    const value = {currentChat, setCurrentChat};

    return(
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}