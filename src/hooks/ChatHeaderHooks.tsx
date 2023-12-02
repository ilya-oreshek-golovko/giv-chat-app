import { useContext, useState } from "react";
import {AiOutlineArrowLeft} from 'react-icons/ai';
import { ChatContext } from "../context/ChatContext";


function useCloseChat(){

    const {setCurrentChat} = useContext(ChatContext);

    function closeCurrentChat(){
        setCurrentChat({
            chatID: "",
            unreadedMessages: [],
            user: {
                name: "",
                photoURL: "",
                uid: ""
            }
        });
    }

    function CloseChatComponent(){
        return(
            <AiOutlineArrowLeft className="btn-chat-close" onClick={closeCurrentChat}/>
        )
    }

    return{
        CloseChatComponent
    }
}

export {
    useCloseChat
}