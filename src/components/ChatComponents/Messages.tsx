import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { getChatHeader, removeMessageFromUnreaded, updateMessagesList } from "../../firebase/chat";
import { useFriendChatHeader, useMessages } from "../../hooks/hooks";
import { IChatHeader, IMessage } from "../../interfaces";
import { TContextMenu } from "../../types";
import ContextMenu from "../ContextMenu/ContextMenu";
import Message from "./Message";
import { useContext, useEffect, useState } from "react";

export default function Messages() {

  const currentUser = useContext(AuthContext);
  const {currentChat} = useContext(ChatContext);
  const {messages, setMessages}= useMessages();
  const friendChatHeader : IChatHeader | undefined = useFriendChatHeader(currentChat.user.uid);
  const userChatHeader   : IChatHeader | undefined = useFriendChatHeader(currentUser.uid);

  const [ContextMenuState, setContextMenuState] = useState<TContextMenu>({
    top: 0,
    left: 0,
    isOpen: false,
    handleDeleteClick: () => {},
    handleEditClick: () => {}  
  });

  useEffect(() => {
    if(!messages) return;
    const newState = messages.map(message => ({...message, isReaded: true}));
    setMessages(newState);
  }, [userChatHeader || friendChatHeader])


  function isMessageReaded(renderedMessageID : string, senderID : string){
    const defineIfMessageReaded = (validChatHeader : IChatHeader | undefined) => {
      if(!validChatHeader) return true;

      if(!validChatHeader.unreadedMessages) return true;
  
      return !validChatHeader.unreadedMessages.some(messageID => messageID == renderedMessageID);
    }
    let isMessageReaded = false;

    switch(senderID){
      case currentUser.uid:
        isMessageReaded = defineIfMessageReaded(friendChatHeader);
        break;
      case currentChat.user.uid:
        isMessageReaded = defineIfMessageReaded(userChatHeader);
        break;
      default:
        console.log(`Error while defining sender ID for a message: ${renderedMessageID}`);
    }

    return isMessageReaded;
  }

  function handleMarkMessageAsReaded(messageIDToDelete : string){
    console.log(messageIDToDelete);
    if(!currentChat?.unreadedMessages) return;

    removeMessageFromUnreaded(currentUser.uid, currentChat.chatID, messageIDToDelete, currentChat.unreadedMessages);
  }

  function handleRightClick(pageX : number, pageY : number, messageID : string, senderID : string, isSelectedMessageReaded : boolean){
    console.log(messageID);

    const handleDeleteClick = async () => {
      
      const checkIfMessageIsUnreaded = async () => {
        if(!friendChatHeader?.unreadedMessages) return;

        // const unreadedMessagesOfFriend : Array<string> = friendChatHeader.unreadedMessages;
        // const isSelectedMessageUnreaded = unreadedMessagesOfFriend.some(unreadedMessageID => unreadedMessageID == messageID);

        if(isSelectedMessageReaded) return;
        removeMessageFromUnreaded(currentChat.user.uid, currentChat.chatID, messageID, friendChatHeader.unreadedMessages);
      };
      checkIfMessageIsUnreaded();

      const newMessagesList = messages?.filter(message => message.id !== messageID);
      if(!newMessagesList) return;
      await updateMessagesList(currentChat.chatID, newMessagesList);
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

  return (
    <div className={'chat-main' + (!messages ? ' empty-chat' : '')}>
      {
        !messages
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
