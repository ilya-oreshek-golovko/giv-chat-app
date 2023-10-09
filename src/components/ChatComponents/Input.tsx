import { ChangeEvent, useContext, useState } from 'react';
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
import Modal from '../Modal';

const l = (mes : any) => console.log("Input: ", mes);

type TDocument = {
  docFile : File | undefined,
  docLink : string
}
type TImage = {
  imgFile : File | undefined,
  imgLink : string
}
type InputState = {
  text : string,
  images : Array<TImage>,
  documents: Array<TDocument>
}
export default function Input() {

  const currentUser = useContext(AuthContext);
  const chatData = useContext(ChatContext);

  //const docRef = useRef() as React.RefObject<HTMLInputElement>;
  const [state, setState] = useState<InputState>({
    text: "",
    images : [],
    documents: []
  });
  // const [text, setText] = useState<string>();
  // const [doc, setDoc] = useState<File | undefined>();
  // const [img, setImg] = useState<File | undefined>();
  //const [inputError, setInputError] = useState<string>();

  function inputValidation(){
    // if(!chatData?.currentChat?.chatID){
    //   l("*Cannot identify the related chat. Please select a friend");
    //   //setInputError("*Please type a message or select a file/image");
    //   return false;
    // }else if(!state.text || state.img?.size == 0){
    //   l("*Please type a message or select a file/image");
    //   //setInputError("*Cannot identify the related chat. Please contact sysadmin");
    //   return false;
    // }

    // //setInputError("");
    // return true;
  }
  
  async function saveMessage(url : string = ""){
    // if(!url && !state.text) return;

    // const message : IMessage = {
    //   senderID: currentUser.uid,
    //   text : state.text,
    //   img: url,
    //   id: uuid(),
    //   date: Timestamp.now()
    // };

    // await addMessage(message, chatData?.currentChat?.chatID!); // chatID will be checked in validation function
    // l("Message saved");
  }

  async function handleSendClick(evt : React.MouseEvent<HTMLButtonElement>){
    // evt.preventDefault();

    // if(!inputValidation()) return null;

    // if(state.img){
    //   const fileRef = ref(storage, uuid());
    //   await uploadBytesResumable(fileRef, state.img).then(() => {
    //     getDownloadURL(fileRef).then((url) => {
    //       l(`File saved(${url})`);
    //       saveMessage(url);
    //     });
    //   });
    // }else{
    //   saveMessage();
    // }

    // setState({
    //   text: "",
    //   doc : undefined,
    //   img : undefined,
    //   imgDisplay: ""
    // });
  }

  function handleDocumentChange(evt : ChangeEvent<HTMLInputElement>){
    if(evt.target.files && evt.target.files[0]){
      setState(prevState => ({
        ...prevState, 
        documents: [
          ...prevState?.documents, 
          {
            docFile : evt.target.files![0], 
            docLink : ""
          }
        ]
      }));
    }
  }

  function handleImageChange(evt : ChangeEvent<HTMLInputElement>){
    if(evt.target.files && evt.target.files[0]){
      setState(prevState => ({
        ...prevState, 
        images: [
          ...prevState?.images, 
          {
            imgFile : evt.target.files![0], 
            imgLink : URL.createObjectURL(evt.target.files![0])
          }
        ]
      }));
    }
  }

  function handleImagesClick(evt : React.MouseEvent<HTMLButtonElement>){
    evt.preventDefault();
    return
  }

  return (
    <div className="chat-footer">
      {/* {
        state.imgDisplay &&
        <div className="chat-footer-preview-block">
          <img src={state.imgDisplay} alt="preview" className='chat-footer-img-pereview'/>
        </div>
      } */}
        <input type="text" className="chat-message-input" placeholder='Type a message' value={state?.text} onChange={(e) => setState(prevState => ({...prevState, text: e.target.value}))}/>
        {/* {
          inputError &&
          <div className="chat-footer-error">
            {inputError}
          </div>
        } */}
        <div className="chat-message-actions-box">
          <label>
              <BsPaperclip className="btn chat-clip-doc"/>
              <input type="file" className="input-file" onChange={handleDocumentChange}/>
              {
                state.documents.length > 0 &&
                <button className="chat-btn-preview-files">{state.documents.length}</button>
              }
          </label>
          <label>
              <MdOutlineAddPhotoAlternate className="btn chat-clip-image"/>
              <input type="file" className="input-file" onChange={handleDocumentChange}/>
              {
                state.images.length > 0 &&
                <button className="chat-btn-preview-files" onClick={handleImagesClick}>{state.images.length}</button>
              }
          </label>
          <button className="btn chat-btn-send-message" onClick={handleSendClick}>Send</button>
        </div>
        <Modal>{
        <div>Hui Ilya</div>  
        }</Modal>
    </div>
  )
}
