import { useContext, useState } from "react";
import { IChatHeader, IUserInfoHeader } from "../../interfaces";
import { ChatContext } from "../../context/ChatContext";
import Friend from "./Friend";
import { clearUnreadedMessages, getChatHeader, removeChatHeader as removeChatFromChatHeader, removeChatMessages, updateChatHeader } from "../../firebase/chat";
import { AuthContext } from "../../context/AuthContext";
import { TContextMenu } from "../../types";
import ContextMenu from "../ContextMenu/ContextMenu";
import { serverTimestamp } from "firebase/firestore";

export default function Friends({receivedChats} : {receivedChats : IChatHeader[]}) {

    const {currentChat, setCurrentChat} = useContext(ChatContext);
    const currentUser = useContext(AuthContext);

    const [ContextMenuState, setContextMenuState] = useState<TContextMenu>({
        top: 0,
        left: 0,
        isOpen: false,
        handleDeleteClick: () => {}
    });

    function handleRightClick(pageX : number, pageY : number, friendChatHeaderID : string, chatID : string){

        const handleDeleteClick = async () => {

            const removeAllMessagesIfFriendNotExist = async () => {
                const friendChatHeader = await getChatHeader(friendChatHeaderID);
                console.log("friendChatHeader exist");
                if(friendChatHeader) return;
                console.log("friendChatHeader not exist");
                removeChatMessages(chatID);
            };
            const clearCurrentChatIfItWasRemoved = () => {
                if(currentChat.chatID != chatID) return;
                setCurrentChat({
                    chatID: "",
                    unreadedMessages: [],
                    user: {
                        name: "",
                        photoURL: "",
                        uid: ""
                    }
                })
            }

            removeChatFromChatHeader(currentUser.uid, chatID).then(isSuccess => {
                setContextMenuState(prevState => ({...prevState, isOpen: false}));
                if(!isSuccess) return;
                removeAllMessagesIfFriendNotExist();
                clearCurrentChatIfItWasRemoved();
            });
        }
    
        setContextMenuState(prevState => ({
          top: pageX,
          left: pageY,
          isOpen: !prevState.isOpen,
          handleDeleteClick
        }));
    
    }

    async function handleFriendClick(chatHeader : IChatHeader){
        if(currentChat.chatID == chatHeader.uid) return;

        if(chatHeader.unreadedMessages && chatHeader.unreadedMessages.length > 0){
            clearUnreadedMessages(currentUser.uid, chatHeader.uid);
        }

        const updateChatHeaderSelectedUser = async () => {
            const friendChatHeader = await getChatHeader(chatHeader.userInfo.uid);
            if(friendChatHeader?.dateCreated && friendChatHeader?.userInfo) return;
            
            const currentUserInfo : IUserInfoHeader = {
                name: currentUser.name,
                photoURL: currentUser.photoURL,
                uid: currentUser.uid
            }
            const friendChats = {
              [`${chatHeader.uid}.userInfo`] : currentUserInfo,
              [`${chatHeader.uid}.dateCreated`] : serverTimestamp()
            }
      
            await updateChatHeader(chatHeader.userInfo.uid, friendChats);
        }

        updateChatHeaderSelectedUser();
        setCurrentChat({
            chatID: chatHeader.uid,
            user: chatHeader.userInfo,
            unreadedMessages: chatHeader.unreadedMessages || []
        });
    }
    //   console.log("TreceivedChats");
    //   console.log(TreceivedChats);
    return (
        <div className='sidebar-friends'>
            {
                receivedChats.length > 0 &&
                receivedChats.sort((a,b) => {
                    return b.lastMessage.date > a.lastMessage.date ? 1 : -1
                }).map((chatHeader : IChatHeader) => (
                    <Friend 
                        chatHeader={chatHeader}
                        handleObjClick={() => handleFriendClick(chatHeader)}
                        handleRightClick={handleRightClick}
                    />
                ))
            }
            {
                ContextMenuState.isOpen &&
                <ContextMenu 
                    top={ContextMenuState.top} 
                    left={ContextMenuState.left} 
                    handleDeleteClick={ContextMenuState.handleDeleteClick} 
                    handleEditClick={ContextMenuState.handleEditClick} />
            }
        </div>
    )
}
