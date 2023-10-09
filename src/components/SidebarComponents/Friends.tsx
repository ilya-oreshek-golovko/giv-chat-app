import { useContext } from "react";
import { getCombinedChatID, useChats } from "../../hooks/hooks";
import { IChatHeader } from "../../interfaces";
import { ChatContext } from "../../context/ChatContext";
import Friend from "./Friend";

export default function Friends() {

    const chats : IChatHeader[] | undefined = useChats();
    const chat = useContext(ChatContext);

    return (
        <div className='sidebar-friends'>
            {
                chats 
                ?
                chats.map(({uid, userInfo, date}) => (
                    <Friend key={userInfo.uid} friendName={userInfo.name} lastMessage={"test mes 1"} src={userInfo.photoURL} handleObjClick={function (event: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
                        event.preventDefault();
                        chat?.setCurrentChat({
                            chatID: uid,
                            user: userInfo
                        });
                    } }/>
                ))
                :
                "Loading..."
            }
        </div>
    )
}
