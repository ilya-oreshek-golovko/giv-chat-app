import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { IMessage } from "../../interfaces";
import { useContext, useRef, useEffect } from "react"

export default function Message({message} : {message : IMessage}) {

  const currentUser = useContext(AuthContext);
  const chatData    = useContext(ChatContext);

  const ref = useRef() as React.RefObject<HTMLInputElement>;

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  function getMessageDate(){
    const mDate = message.date.toDate();
    return `${mDate.getDate()}.${mDate.getMonth()+1}.${mDate.getFullYear()}`;
  }

  console.log(message);

  return (
    <div ref={ref} className={"chat-message " + (currentUser.uid == message.senderID ? "owner-message" : "friend-message")}>
      <div className="message-info">
        <img src={currentUser.uid == message.senderID ? currentUser.photoURL : chatData?.currentChat?.user.photoURL} alt="profile-img" className="message-profile-img" />
        <div className="message-date-time">{getMessageDate()}</div>
      </div>
      {
        message.text &&
        <p className={"message-content " + (currentUser.uid == message.senderID ? "owner-content" : "friend-content")}>
          {message.text}
        </p>
      }
      {
        message.images?.length > 0 &&
        <div className="message-images-box">
          {
            message.images.map((imageLink : string) => (
              <img src={imageLink} alt="img" className="message-image" />
            ))    
          }
        </div>
      }
    </div>
  )
}
