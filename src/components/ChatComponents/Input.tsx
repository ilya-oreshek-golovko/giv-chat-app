import { useContext, useRef, useState, ChangeEvent } from 'react';
import { BsPaperclip } from 'react-icons/bs';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { IMessage } from '../../interfaces';
import { addMessage } from '../../firebase/chat';
import { AuthContext } from '../../context/AuthContext';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase/firebase';
import { ChatContext } from '../../context/ChatContext';
import { v4 as uuid } from "uuid"; 
import { Timestamp } from 'firebase/firestore';

const l = (mes : any) => console.log("Input: ", mes);

export default function Input() {

  const currentUser = useContext(AuthContext);
  const chatData = useContext(ChatContext);

  const docRef = useRef() as React.RefObject<HTMLInputElement>;
  const [text, setText] = useState<string>();
  const [img, setImg] = useState<File | undefined>();
  //const [inputError, setInputError] = useState<string>();

  // function inputValidation(){
  //   if(!textRef.current?.value || img?.size == 0){
  //     l("*Please type a message or select a file/image");
  //     //setInputError("*Please type a message or select a file/image");
  //     return false;
  //   }else if(!chatData?.currentChat?.chatID){
  //     l("*Cannot identify the related chat. Please select a friend");
  //     //setInputError("*Cannot identify the related chat. Please contact sysadmin");
  //     return false;
  //   }

  //   //setInputError("");
  //   return true;
  // }
  
  async function saveMessage(url : string = ""){
    if(!url && !text) return;

    const message : IMessage = {
      senderID: currentUser.uid,
      text : text!,
      img: url,
      id: uuid(),
      date: Timestamp.now()
    };

    await addMessage(message, chatData?.currentChat?.chatID!); // chatID will be checked in validation function
    l("Message saved");
  }

  async function handleSendClick(evt : React.MouseEvent<HTMLButtonElement>){
    evt.preventDefault();

    //if(!inputValidation()) return null;

    if(img){
      const fileRef = ref(storage, uuid());
      await uploadBytesResumable(fileRef, img).then(() => {
        getDownloadURL(fileRef).then((url) => {
          l(`File saved(${url})`);
          saveMessage(url);
        });
      });
    }else{
      saveMessage();
    }

    setText("");
    setImg(undefined);
  }

  return (
    <div className="chat-footer">
        <input type="text" className="chat-message-input" placeholder='Type a message' value={text} onChange={(e) => setText(e.target.value)}/>
        {/* {
          inputError &&
          <div className="chat-footer-error">
            {inputError}
          </div>
        } */}
        <div className="chat-message-actions-box">
          <label>
              <BsPaperclip className="btn chat-clip-doc"/>
              <input type="file" className="input-file" ref={docRef}/>
          </label>
          <label>
              <MdOutlineAddPhotoAlternate className="btn chat-clip-image"/>
              <input type="file" className="input-file" onChange={(evt) => setImg(evt.target.files![0])}/>
          </label>
          <button className="btn chat-btn-send-message" onClick={handleSendClick}>Send</button>
        </div>
    </div>
  )
}
