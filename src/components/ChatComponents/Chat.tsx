import { useContext } from 'react';
import ChatHeader from './ChatHeader';
import Input from './Input';
import Messages from './Messages';
import { ChatContext } from '../../context/ChatContext';

export default function Chat() {

  const {currentChat} = useContext(ChatContext);

  return (
    <div className={'home-chat ' + (currentChat.chatID ? 'open' : '')}>
      <ChatHeader currentFriendName={currentChat.user.name}/>
      <Messages/>
      {
        currentChat.chatID && <Input />
      }
    </div>
  )
}

