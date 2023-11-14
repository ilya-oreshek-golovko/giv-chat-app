import { useContext } from 'react';
import ChatHeader from './ChatHeader';
import Input from './Input';
import Messages from './Messages';
import { ChatContext } from '../../context/ChatContext';
import { IChatHeader } from '../../interfaces';

export default function Chat() {

  const {currentChat} = useContext(ChatContext);

  return (
    <div className='home-chat'>
      <ChatHeader currentInterlocutorName={
        currentChat.user.name != undefined 
        ? currentChat.user.name 
        : ""
      }/>
      <Messages/>
      {
        currentChat.chatID && <Input />
      }
    </div>
  )
}

