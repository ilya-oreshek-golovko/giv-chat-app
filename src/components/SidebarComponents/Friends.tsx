import { useContext } from "react";
import { getCombinedChatID, useChats } from "../../hooks/hooks";
import { IChatHeader } from "../../interfaces";
import { ChatContext } from "../../context/ChatContext";
import Friend from "./Friend";
import { clearUnreadedMessages } from "../../firebase/chat";
import { AuthContext } from "../../context/AuthContext";

export default function Friends({receivedChats} : {receivedChats : IChatHeader[]}) {

    const {currentChat, setCurrentChat} = useContext(ChatContext);
    const currentUser = useContext(AuthContext);

    return (
        <div className='sidebar-friends'>
            {
                receivedChats.length > 0 &&
                receivedChats.map((chatHeader : IChatHeader) => (
                    <Friend 
                        chatHeader={chatHeader}
                        handleObjClick={
                            (evt : React.MouseEvent<HTMLDivElement>) => {
                                evt.preventDefault();
                                if(currentChat.chatID == chatHeader.uid) return;

                                if(chatHeader.unreadedMessages && chatHeader.unreadedMessages.length > 0){
                                    clearUnreadedMessages(currentUser.uid, chatHeader.uid);
                                }

                                setCurrentChat({
                                    chatID: chatHeader.uid,
                                    user: chatHeader.userInfo,
                                    //unreadedMessages: []
                                    unreadedMessages: chatHeader.unreadedMessages || []
                                });
                            }
                        }
                    />
                ))
            }
        </div>
    )
}
