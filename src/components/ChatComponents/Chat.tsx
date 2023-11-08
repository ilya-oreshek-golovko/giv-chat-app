import { useContext } from 'react';
import ChatHeader from './ChatHeader';
import Input from './Input';
import Messages from './Messages';
import { ChatContext } from '../../context/ChatContext';

export default function Chat() {

  const chatObj = useContext(ChatContext);

  return (
    <div className='home-chat'>
      <ChatHeader currentInterlocutorName={
        chatObj?.currentChat?.user.name != undefined 
        ? chatObj.currentChat.user.name 
        : ""
      }/>
      <Messages />
      {
        chatObj?.currentChat?.chatID && <Input />
      }
    </div>
  )
}

