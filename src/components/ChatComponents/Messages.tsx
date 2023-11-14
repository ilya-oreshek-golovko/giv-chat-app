import { ChatContext } from "../../context/ChatContext";
import { useFriendChatHeader, useMessages } from "../../hooks/hooks";
import { IChatHeader, IMessage } from "../../interfaces";
import Message from "./Message";
import { useContext, useEffect, useRef, useState } from "react";

export default function Messages() {

  const {currentChat} = useContext(ChatContext);
  const messages : IMessage[] | undefined = useMessages();
  const friendChatHeader : IChatHeader | undefined = useFriendChatHeader();
  const chatMainRef = useRef(null);

  // console.log("Messages");
  // console.log(messages);
  // console.log(friendChatHeader?.unreadedMessages);

  // function scrollTest(evt : any){
  //   const {target} = evt;
  //   // Все позиции элемента
  //   // const targetPosition = {
  //   //   top: window.scrollY + target.getBoundingClientRect().top,
  //   //   left: window.scrollX + target.getBoundingClientRect().left,
  //   //   right: window.scrollX + target.getBoundingClientRect().right,
  //   //   bottom: window.scrollY + target.getBoundingClientRect().bottom
  //   // };
  //   const scrollBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
  //   console.log(scrollBottom);
  // }

  function isMessageReaded(renderedMessageID : string){
    if(!friendChatHeader) return true;

    if(!friendChatHeader.unreadedMessages) return true;

    return !friendChatHeader.unreadedMessages.some(messageID => messageID == renderedMessageID);
  }

  return (
    <div className={'chat-main' + (currentChat == undefined ? ' empty-chat' : '')} ref={chatMainRef}>
      {
        ( !messages || !friendChatHeader?.unreadedMessages ) 
        ?
        <div className="chat-empty-content">Pick a friend to start a dialog</div>
        :
        messages?.map((message) => (<Message message={message} isReaded={isMessageReaded(message.id)} ref={chatMainRef}/>))
      }
    </div>
  )
}
