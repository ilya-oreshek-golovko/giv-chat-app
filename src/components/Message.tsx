export default function Message({text, date, flag} : {text : string, date : string, flag : boolean}) {
  return (
    <div className={"chat-message " + (flag ? "owner-message" : "friend-message")}>
      <div className="message-info">
        <img src="https://images.vexels.com/media/users/3/145908/raw/52eabf633ca6414e60a7677b0b917d92-criador-de-avatar-masculino.jpg" alt="profile" className={"message-profile-img " + (flag ? "owner-profile" : "friend-profile")} />
        <div className="message-date-time">{date}</div>
      </div>
      <p className={"message-content " + (flag ? "owner-content" : "friend-content")}>{text}</p>
    </div>
  )
}
