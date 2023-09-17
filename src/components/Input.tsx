import { BsPaperclip } from 'react-icons/bs';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';

export default function Input() {
  return (
    <div className="chat-footer">
        <input type="text" className="chat-message-input" placeholder='Type a message'/>
        <div className="chat-message-actions-box">
          <BsPaperclip className='btn chat-clip-doc'/>
          <MdOutlineAddPhotoAlternate className='btn chat-clip-image'/>
          <button className="btn chat-btn-send-message">Send</button>
        </div>
    </div>
  )
}
