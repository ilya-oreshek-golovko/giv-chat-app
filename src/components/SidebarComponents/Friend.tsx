import { FriendProps } from '../../types'

export default function Friend({key, friendName, lastMessage, src, handleObjClick} : FriendProps) {

  function displayLastMessage(){
    return lastMessage.length > 40 ? lastMessage.substring(0, 40) + "..." : lastMessage;
  }

  return (
    <div className='home-friend' key={key} onClick={handleObjClick}>
        <div className='friend-img-box'>
          <img src={src} alt="friend" className='friend-img'/>
        </div>
        <div className='friend-content-box'>
          <h3 className='friend-title'>{friendName}</h3>
          {lastMessage && <p className='friend-description'>{displayLastMessage()}</p>}
        </div>
    </div>
  )
}
