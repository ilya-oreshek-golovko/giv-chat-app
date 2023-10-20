import { ChangeEvent, MouseEvent, useContext, useState } from 'react';
import { BsPaperclip } from 'react-icons/bs';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { IMessage } from '../../interfaces';
import { addMessage } from '../../firebase/chat';
import { AuthContext } from '../../context/AuthContext';
import { getDownloadURL, list, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase/firebase';
import { ChatContext } from '../../context/ChatContext';
import { v4 as uuid } from "uuid"; 
import { Timestamp } from 'firebase/firestore';
import SelectedFiles from './SelectedFiles';

const l = (mes : any) => console.log("Input: ", mes);

export type TDocument = {
  docFile : File,
  docLink : string
}
export type TImage = {
  imgFile : File,
  imgLink : string
}
type InputState = {
  text : string,
  images : Array<TImage>,
  documents: Array<TDocument>,
  isModalOpen: boolean
}
export default function Input() {

  const currentUser = useContext(AuthContext);
  const chatData = useContext(ChatContext);

  const [state, setState] = useState<InputState>({
    text: "",
    images : [],
    documents: [],
    isModalOpen : false
  });

  function clearInputFiels(){
    setState({
      text: "",
      documents : [],
      images: [],
      isModalOpen: false
    });
  }
  
  function inputValidation(){
    if(!chatData?.currentChat?.chatID){
      l("*Cannot identify the related chat. Please select a friend");
      //setInputError("*Please type a message or select a file/image");
      return false;
    }else if(!state.text && state.images.length == 0 && state.documents.length == 0){
      l("*Please type a message or select a file/image");
      //setInputError("*Cannot identify the related chat. Please contact sysadmin");
      return false;
    }

    //setInputError("");
    return true;
  }
  
  async function saveMessage(imagesStorageLinks : Array<string>, documentsStorageLinks : Array<string>){
    
    const message : IMessage = {
      senderID: currentUser.uid,
      text : state.text,
      images : imagesStorageLinks,
      documents : documentsStorageLinks,
      id: uuid(),
      date: Timestamp.now()
    };

    await addMessage(message, chatData?.currentChat?.chatID!); // chatID will be checked in validation function
    l("Message saved");
  }

  function getUploadImagesLinks() : Array<string> {
    if(state.images.length == 0) return [];

    const imagesStorageLinks : Array<string> = [];

    state.images.forEach( async (imageObj : TImage) => {
      const fileRef = ref(storage, uuid());

      await uploadBytesResumable(fileRef, imageObj.imgFile).then(() => {
          getDownloadURL(fileRef).then((imageURLfromStorage) => {
            imagesStorageLinks.push(imageURLfromStorage);
          });
      }); 

    });
    
    return imagesStorageLinks;
  }

  function getUploadDocumentsLinks() : Array<string> {
    if(state.documents.length == 0) return [];

    const documentsStorageLinks : Array<string> = [];

    state.documents.forEach( async (docObj : TDocument) => {
      const fileRef = ref(storage, uuid());

      await uploadBytesResumable(fileRef, docObj.docFile).then(() => {
          getDownloadURL(fileRef).then((docURLfromStorage) => {
            documentsStorageLinks.push(docURLfromStorage);
          });
      }); 

    });
    
    return documentsStorageLinks;
  }

  function handleSendClick(evt : React.MouseEvent<HTMLButtonElement>){
    evt.preventDefault();

    if(!inputValidation()) return;

    const imagesStorageLinks : Array<string> = getUploadImagesLinks();

    const documentsStorageLinks : Array<string> = getUploadDocumentsLinks();

    l(`imagesStorageLinks : ${imagesStorageLinks.length}`);
    l(`documentsStorageLinks : ${documentsStorageLinks.length}`);
    saveMessage(imagesStorageLinks, documentsStorageLinks);

    clearInputFiels();
  }

  function handleDocumentChange(evt : ChangeEvent<HTMLInputElement>){
    l(evt.target.files![0]);
    if(evt.target.files && evt.target.files[0]){
      setState(prevState => ({
        ...prevState, 
        documents: [
          ...prevState?.documents, 
          {
            docFile : evt.target.files![0], 
            docLink : URL.createObjectURL(evt.target.files![0])
          }
        ]
      }));
    }
  }

  function handleImageChange(evt : ChangeEvent<HTMLInputElement>){
    l(evt.target.files![0]);
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

  function handleModalView(evt : React.MouseEvent<HTMLButtonElement>){
    evt.preventDefault();
    setState(prevState => ({
      ...prevState,
      isModalOpen: !prevState.isModalOpen
    }));
  }

  function clearSelectedFiles(listType : string){
    if(listType == "images") {
      setState(prevState => ({
        ...prevState,
        isModalOpen: false,
        images: []
      }));
    }else if(listType == "documents"){
      setState(prevState => ({
        ...prevState,
        isModalOpen: false,
        documents: []
      }));
    }else{
      l("Error: unable to define list type to delete selected files");
    }
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
              <input type="file" className="input-file" accept='.docx' onChange={handleDocumentChange}/>
              {
                state.documents.length > 0 &&
                <button className="chat-btn-preview-files" onClick={handleModalView}>{state.documents.length}</button>
              }
          </label>
          <label>
              <MdOutlineAddPhotoAlternate className="btn chat-clip-image"/>
              <input type="file" className="input-file" accept='image/*' onChange={handleImageChange}/>
              {
                state.images.length > 0 &&
                <button className="chat-btn-preview-files" onClick={handleModalView}>{state.images.length}</button>
              }
          </label>
          <button className="btn chat-btn-send-message" onClick={handleSendClick}>Send</button>
        </div>

        <SelectedFiles modalState={state.isModalOpen} images={state.images} documents={state.documents} handleModalView={handleModalView} clearSelectedFiles={clearSelectedFiles} />
    </div>
  )
}
