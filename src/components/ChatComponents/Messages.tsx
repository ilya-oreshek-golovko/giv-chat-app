import { ChatContext } from "../../context/ChatContext";
import { useMessages } from "../../hooks/hooks";
import Message from "./Message";
import { useContext } from "react";

/*
messages.map(message => (
          <Message text={message.text} date={message.date} flag={message.flag} />
        ))
*/
export default function Messages() {

  const cChat = useContext(ChatContext);
  const messages = useMessages();

    // const messages = [

    //     {
    //       text: "test text text text !",
    //       date: "Just now",
    //       flag: true
    //     },
    //     {
    //       text: "test text text text !111111111111111 fsdddddd sddddddw weeeeeeeee we",
    //       date: "Just now",
    //       flag: false
    //     },
    //     {
    //       text: "test text text text !",
    //       date: "Just now"
    //       ,flag: true
    //     },
    //     {
    //       text: "test text text text !",
    //       date: "Just now",
    //       flag: false
    //     },
    //     {
    //       text: "test text text text !",
    //       date: "Just now",
    //       flag: true
    //     },
    //   ];
    // console.log("Ilya messages Test");
    // console.log(messages);
  return (
    <div className={'chat-main' + (cChat?.currentChat == undefined ? ' empty-chat' : '')}>
      {
        cChat?.currentChat == undefined &&
        <div className="chat-empty-content">Pick a friend to start a dialog</div>
      }
      {
        messages!.length > 0 &&
        messages!.map((message) => (<Message message={message}/>))
      }
      </div>
  )
}
