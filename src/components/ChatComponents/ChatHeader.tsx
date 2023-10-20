import { BsFillCameraVideoFill } from 'react-icons/bs';
import { MdPersonAddAlt1 } from 'react-icons/md';
import { BiDotsHorizontalRounded } from 'react-icons/bi';

export default function ChatHeader({currentInterlocutorName} : {currentInterlocutorName : string}) {
  return (
    <div className='chat-header'>
        <div className="chat-friend-name">
          {currentInterlocutorName}
        </div>
        <div className="chat-action-buttons-box">
          <BsFillCameraVideoFill className="btn chat-btn-video-call" />
          <MdPersonAddAlt1 className="btn chat-btn-phone-call" />
          <BiDotsHorizontalRounded className="btn chat-additional-options" />
        </div>
    </div>
  )
}
