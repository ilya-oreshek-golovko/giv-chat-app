import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { IMessage } from "../../interfaces";
import { useContext } from "react"

export default function Message({message} : {message : IMessage}) {

  const currentUser = useContext(AuthContext);
  const chatData    = useContext(ChatContext);

  return (
    <div className={"chat-message " + (currentUser.uid == message.senderID ? "owner-message" : "friend-message")}>
      <div className="message-info">
        <img src={currentUser.uid == message.senderID ? currentUser.photoURL : chatData?.currentChat?.user.photoURL} alt="profile-img" className="message-profile-img" />
        <div className="message-date-time">{message.date.toDate().getDate()}</div>
      </div>
      <p className={"message-content " + (currentUser.uid == message.senderID ? "owner-content" : "friend-content")}>
        {message.text}
      </p>
    </div>
  )
}
