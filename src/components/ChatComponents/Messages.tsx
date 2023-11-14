import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { markMessageAsReaded } from "../../firebase/chat";
import { useFriendChatHeader, useMessages } from "../../hooks/hooks";
import { IChatHeader, IMessage } from "../../interfaces";
import Message from "./Message";
import { useContext, useEffect } from "react";

export default function Messages() {

  const currentUser = useContext(AuthContext);
  const {currentChat} = useContext(ChatContext);
  const {messages, setMessages}= useMessages();
  const friendChatHeader : IChatHeader | undefined = useFriendChatHeader(currentChat.user.uid);
  const userChatHeader   : IChatHeader | undefined = useFriendChatHeader(currentUser.uid);

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

    markMessageAsReaded(currentUser.uid, currentChat.chatID, messageIDToDelete, currentChat.unreadedMessages);
  }
console.log(friendChatHeader);
console.log(userChatHeader);
  return (
    <div className={'chat-main' + (!messages ? ' empty-chat' : '')}>
      {
        !messages
        ?
        <div className="chat-empty-content">Pick a friend to start a dialog</div>
        :
        messages?.map((message) => (<Message message={message} isReaded={isMessageReaded(message.id, message.senderID)} handleMarkMessageAsReaded={handleMarkMessageAsReaded}/>))
      }
    </div>
  )
}
