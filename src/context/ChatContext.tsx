import { Dispatch, SetStateAction, createContext, useEffect, useState, useContext } from "react";
import { IChat } from "../interfaces";
import { AuthContext } from "./AuthContext";

export type ChatType = {
    currentChat : IChat | undefined,
    setCurrentChat : Dispatch<SetStateAction<IChat | undefined>>
}

export const ChatContext = createContext<ChatType | undefined>(undefined);

export function ChatContextProvider({children} : {children : any}){

    const currentUser = useContext(AuthContext);
    const [currentChat, setCurrentChat] = useState<IChat>();

    useEffect(() => {

        const resetCurrentChat = () => {
            console.log("ChatProvider Reset");
            setCurrentChat(undefined)
        }

        return () =>{
            resetCurrentChat()
        }
    }, [currentUser?.uid])

    return(
        <ChatContext.Provider value={{currentChat, setCurrentChat}}>
            {children}
        </ChatContext.Provider>
    )
}