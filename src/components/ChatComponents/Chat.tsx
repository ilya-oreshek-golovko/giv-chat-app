import ChatHeader from './ChatHeader';
import Input from './Input';
import Messages from './Messages';

export default function Chat() {

  return (
    <div className='home-chat'>
      <ChatHeader />
      <Messages />
      <Input />
    </div>
  )
}
