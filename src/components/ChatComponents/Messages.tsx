import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { removeMessageFromUnreaded, updateChatHeader, updateMessagesList } from "../../firebase/chat";
import { useChatHeader, useLastMessageManagement, useMessagesManagement } from "../../hooks/hooks";
import { IChatHeader, IMessage } from "../../interfaces";
import { ChatHeaderType, TContextMenu } from "../../types";
import ContextMenu from "../ContextMenu/ContextMenu";
import Message from "./Message";
import { useContext, useEffect, useState } from "react";

export default function Messages() {

  const currentUser = useContext(AuthContext);
  const {currentChat} = useContext(ChatContext);
  const friendChatHeader : IChatHeader | undefined = useChatHeader(currentChat, ChatHeaderType.friend);
  const userChatHeader   : IChatHeader | undefined = useChatHeader(currentChat, ChatHeaderType.currentUser);
  const {setMessages, messages, isMessageReaded, handleMarkMessageAsReaded} = useMessagesManagement({
    creationDateUserChatHeader: userChatHeader?.dateCreated, 
    currentUser, 
    userChatHeader, 
    friendChatHeader
  });
  console.log("messages");
  console.log(messages);
  //const {lastMessage, setLastMessage} = useLastMessageManagement(messages); TODO

  const [ContextMenuState, setContextMenuState] = useState<TContextMenu>({
    top: 0,
    left: 0,
    isOpen: false,
    handleDeleteClick: () => {},
    handleEditClick: () => {}  
  });

  useEffect(() => {
    if(messages.length == 0) return;
    const newState = messages.map(message => ({...message, isReaded: true}));
    setMessages(newState);
  }, [userChatHeader || friendChatHeader])

  function handleRightClick(pageX : number, pageY : number, messageID : string, senderID : string, isSelectedMessageReaded : boolean){
    console.log(messageID);

    const handleDeleteClick = async () => {
      // console.log("ZZZZ");
      // console.log(userChatHeader);
      // console.log(friendChatHeader);
      const deleteSelectedMessageFromUnreaded = async () => {
        if(!friendChatHeader?.unreadedMessages) return;

        // const unreadedMessagesOfFriend : Array<string> = friendChatHeader.unreadedMessages;
        // const isSelectedMessageUnreaded = unreadedMessagesOfFriend.some(unreadedMessageID => unreadedMessageID == messageID);

        if(isSelectedMessageReaded) return;
        removeMessageFromUnreaded(currentChat.user.uid, currentChat.chatID, messageID, friendChatHeader.unreadedMessages);
      };
      const removeSelectedMessage = () => {
        const newMessagesList = messages.filter(message => message.id !== messageID);
        updateMessagesList(currentChat.chatID, newMessagesList);
        return newMessagesList;
      }

      deleteSelectedMessageFromUnreaded();
      const newMessagesList = removeSelectedMessage();
      updateLastMessage(newMessagesList, messageID);

      setContextMenuState(prevState => ({...prevState, isOpen: false}));
    }
    const handleEditClick = async () => {
      console.log("Edit");
      if(currentUser.uid !== senderID) return;
      setContextMenuState(prevState => ({...prevState, isOpen: false}));
    }

    setContextMenuState(prevState => ({
      top: pageX,
      left: pageY,
      isOpen: !prevState.isOpen,
      handleDeleteClick,
      handleEditClick
    }));

  }

  function updateLastMessage(newMessagesList : IMessage[], deletedMessageID : string){
    const lastMessage = newMessagesList.at(-1) || {};
    // console.log("lastMessage");
    // console.log(userChatHeader);
    //console.log(userChatHeader?.lastMessage.id == deletedMessageID);
    if(userChatHeader?.lastMessage.id == deletedMessageID && currentChat.chatID){
      const chatHeaderUser = {
        [currentChat.chatID + ".lastMessage"] : lastMessage
      };
      updateChatHeader(userChatHeader.uid, chatHeaderUser);
    }
    //console.log(friendChatHeader?.lastMessage.id == deletedMessageID);
    if(friendChatHeader?.lastMessage.id == deletedMessageID && currentChat.chatID){
      const chatHeaderUser = {
        [currentChat.chatID + ".lastMessage"] : lastMessage
      };
      //console.log("update 2");
      updateChatHeader(friendChatHeader.uid, chatHeaderUser);
      //console.log("update 2 end");
    }
  } 

  return (
    <div className={'chat-main' + (!currentChat.chatID ? ' empty-chat' : '')}>
      {
        !currentChat.chatID
        ?
        <div className="chat-empty-content">Pick a friend to start a dialog</div>
        :
        messages.map((message) => (
        <Message 
          message={message} 
          isReaded={isMessageReaded(message.id, message.senderID)} 
          handleMarkMessageAsReaded={handleMarkMessageAsReaded}
          handleRightClick={handleRightClick}
          ContextMenuState={ContextMenuState}
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
