import { BsFillCameraVideoFill } from 'react-icons/bs';
import { MdPersonAddAlt1 } from 'react-icons/md';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { useCloseChat } from '../../hooks/ChatHeaderHooks';

export default function ChatHeader({currentFriendName} : {currentFriendName : string}) {

  const {CloseChatComponent} = useCloseChat();

  return (
    <div className='chat-header'>
        {
          CloseChatComponent()
        }
        <div className="chat-friend-name">
          {currentFriendName}
        </div>
        <div className="chat-action-buttons-box">
          <BsFillCameraVideoFill className="btn chat-btn-video-call" />
          <MdPersonAddAlt1 className="btn chat-btn-phone-call" />
          <BiDotsHorizontalRounded className="btn chat-additional-options" />
        </div>
    </div>
  )
}
