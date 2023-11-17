import { useContext, useState } from "react";
import { getCombinedChatID, useChats } from "../../hooks/hooks";
import { IChatHeader } from "../../interfaces";
import { ChatContext } from "../../context/ChatContext";
import Friend from "./Friend";
import { clearUnreadedMessages, getChatHeader, removeChatHeader as removeChatFromChatHeader, removeChatMessages } from "../../firebase/chat";
import { AuthContext } from "../../context/AuthContext";
import { TContextMenu } from "../../types";
import ContextMenu from "../ContextMenu/ContextMenu";

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
            //const deleteChatHeader = (chatHeaderID : string, chatID : string) => removeChatHeader(chatHeaderID, chatID);

            const removeAllMessagesIfFriendNotExist = async () => {
                const friendChatHeader = await getChatHeader(friendChatHeaderID);
                console.log("friendChatHeader exist");
                if(friendChatHeader) return;
                console.log("friendChatHeader not exist");
                removeChatMessages(chatID);
            };
            removeAllMessagesIfFriendNotExist();
            console.log("removeChatHeader run");
            removeChatFromChatHeader(currentUser.uid, chatID);
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
            //setContextMenuState(prevState => ({...prevState, isOpen: false}));
        }
    
        setContextMenuState(prevState => ({
          top: pageX,
          left: pageY,
          isOpen: !prevState.isOpen,
          handleDeleteClick
        }));
    
      }

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
