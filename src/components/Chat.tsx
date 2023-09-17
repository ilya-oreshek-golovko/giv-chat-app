import ChatHeader from './ChatHeader';
import Input from './Input';
import Message from './Message';

export default function Chat() {

  const messages = [

    {
      text: "test text text text !",
      date: "Just now",
      flag: true
    },
    {
      text: "test text text text !111111111111111 fsdddddd sddddddw weeeeeeeee we",
      date: "Just now",
      flag: false
    },
    {
      text: "test text text text !",
      date: "Just now"
      ,flag: true
    },
    {
      text: "test text text text !",
      date: "Just now",
      flag: false
    },
    {
      text: "test text text text !",
      date: "Just now",
      flag: true
    },
  ];

  return (
    <div className='home-chat'>
      <ChatHeader />
      <div className={'chat-main' + (messages.length === 0 ? ' empty-chat' : '')}>
      {
        messages.length > 0 &&
        messages.map(message => (
          <Message text={message.text} date={message.date} flag={message.flag} />
        ))
      }
      {
        messages.length === 0 &&
        <div className="chat-empty-content">Pick a friend to start a dialog</div>
      }
      </div>
      <Input />
    </div>
  )
}
