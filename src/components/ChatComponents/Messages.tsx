import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useContextMenuManagement, useMessageClickManagement } from "../../hooks/MessagesHooks";
import { useChatHeader } from "../../hooks/hooks";
import {useMessagesManagement} from "../../hooks/MessagesHooks";
import { IChatHeader } from "../../interfaces";
import { ChatHeaderType } from "../../types";
import { useContext } from "react";

export default function Messages() {

  const currentUser = useContext(AuthContext);
  const {currentChat} = useContext(ChatContext);

  const friendChatHeader : IChatHeader | undefined = useChatHeader(currentChat, ChatHeaderType.friend);
  const userChatHeader   : IChatHeader | undefined = useChatHeader(currentChat, ChatHeaderType.currentUser);

  const {messages, MessagesList, handleMessagesScroll, messagesBoxRef, WaitingSpinner} = useMessagesManagement({
    creationDateUserChatHeader: userChatHeader?.dateCreated, 
    currentUser, 
    userChatHeader, 
    friendChatHeader,
    currentChat
  });

  const {ContextMenuComponent, ContextMenuState, setContextMenuState} = useContextMenuManagement();
  const {handleRightClick} = useMessageClickManagement({userChatHeader, friendChatHeader, currentChat, currentUser, setContextMenuState, messages});

  return (
    <div className={'chat-main' + (!currentChat.chatID ? ' empty-chat' : '')} onScroll={handleMessagesScroll} ref={messagesBoxRef}>
      {
        WaitingSpinner()
      }
      {
        MessagesList(handleRightClick, ContextMenuState)
      }
      {
        ContextMenuComponent()
      }
    </div>
  )
}
