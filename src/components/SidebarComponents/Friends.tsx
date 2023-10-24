import { useContext } from "react";
import { getCombinedChatID, useChats } from "../../hooks/hooks";
import { IChatHeader } from "../../interfaces";
import { ChatContext } from "../../context/ChatContext";
import Friend from "./Friend";

export default function Friends() {

    const chats : IChatHeader[] = useChats();
    const chat = useContext(ChatContext);

    return (
        <div className='sidebar-friends'>
            {
                chats.length > 0 &&
                chats.map(({uid, userInfo, date, lastMessage}) => (
                    <Friend key={userInfo.uid} 
                        friendName={userInfo.name} 
                        lastMessage={lastMessage} 
                        src={userInfo.photoURL} 
                        handleObjClick={
                            (evt : React.MouseEvent<HTMLDivElement>) => {
                                evt.preventDefault();
                                if(chat?.currentChat?.chatID == uid) return;

                                chat?.setCurrentChat({
                                    chatID: uid,
                                    user: userInfo
                                });
                            }
                        }
                    />
                ))
            }
        </div>
    )
}
