import { ChatContext } from "../../context/ChatContext";
import { useMessages } from "../../hooks/hooks";
import Message from "./Message";
import { useContext } from "react";

export default function Messages() {

  const cChat = useContext(ChatContext);
  const messages = useMessages();

  console.log("messages");
  console.log(messages);
  return (
    <div className={'chat-main' + (cChat?.currentChat == undefined ? ' empty-chat' : '')}>
      {
        cChat?.currentChat == undefined &&
        <div className="chat-empty-content">Pick a friend to start a dialog</div>
      }
      {
        messages &&
        messages?.map((message) => (<Message message={message}/>))
      }
      </div>
  )
}
