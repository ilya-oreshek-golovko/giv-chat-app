import { FriendProps } from '../../types'

export default function Friend({chatHeader, handleObjClick} : FriendProps) {

  const {lastMessage, userInfo : friendInfo, uid : key, unreadedMessages} = chatHeader;
  const {name : friendName, photoURL : src} = friendInfo;

  function displayLastMessage(){
    if(!lastMessage) return "";
    return lastMessage.length > 30 ? lastMessage.substring(0, 30) + "..." : lastMessage;
  }

  return (
    <div className="home-friend">
      <div className='friend-main-box' key={key} onClick={handleObjClick}>
          <div className='friend-img-box'>
            <img src={src} alt="friend" className='friend-img'/>
          </div>
          <div className='friend-content-box'>
            <h3 className='friend-title'>{friendName}</h3>
            {lastMessage && <p className='friend-description'>{displayLastMessage()}</p>}
          </div>
      </div>
      {
        (unreadedMessages && unreadedMessages?.length > 0) &&
        <div className='friend-unreaded-messages-box'>
          <div className='friend-unreaded-messages-content'>
            {unreadedMessages.length}
          </div>
        </div>
      }
    </div>
  )
}
// function IsUpdateNeeded(prevState : FriendProps, nextState : FriendProps){
//   return prevState.key === nextState.key;
// }
// export default memo(Friend, IsUpdateNeeded)
