import { ChangeEvent, MouseEvent, useContext, useRef, useState } from 'react';
import { BsPaperclip } from 'react-icons/bs';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { IMessage, IUser } from '../../interfaces';
import { addMessage, updateChatHeader } from '../../firebase/chat';
import { AuthContext } from '../../context/AuthContext';
import { getDownloadURL, list, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase/firebase';
import { ChatContext } from '../../context/ChatContext';
import { v4 as uuid } from "uuid"; 
import { Timestamp } from 'firebase/firestore';
import SelectedFiles from './SelectedFiles';
import Modal from '../Modal';
import LoadingSpinner from '../LoadingSpinner';
import WaitingSpinner from '../WaitingSpinner';

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
  isModalOpen: boolean,
  isSendClicked : boolean
}
export default function Input() {

  const currentUser : IUser = useContext(AuthContext);
  const chatData = useContext(ChatContext);
  const imagesInputRef = useRef() as React.RefObject<HTMLInputElement>;
  const documentsInputRef = useRef() as React.RefObject<HTMLInputElement>;

  const [state, setState] = useState<InputState>({
    text: "",
    images : [],
    documents: [],
    isModalOpen : false,
    isSendClicked : false
  });

  function toggleWaitingSpinner(){
    setState(prevState => ({
      ...prevState,
      isSendClicked: !prevState.isSendClicked
    }));
  }

  function clearInputFiels(){
    setState({
      text: "",
      documents : [],
      images: [],
      isModalOpen: false,
      isSendClicked : false
    });
    imagesInputRef.current!.value = '';
    documentsInputRef.current!.value = '';
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

  function getLastMessage(){
    if(state.text) return state.text;
    
    return "attached"
  }

  async function updateLastMessageForUsers() {
    await updateChatHeader(currentUser.uid, {
      [chatData?.currentChat?.chatID + ".lastMessage"] : getLastMessage()
    });

    await updateChatHeader(chatData?.currentChat?.user.uid!, {
      [chatData?.currentChat?.chatID + ".lastMessage"] : getLastMessage()
    });
  }

  async function getUploadImagesLinks() : Promise<string[]>{
    if(state.images.length == 0) return [];

    const promises : Promise<string>[] = state.images.map((imageObj : TImage) => new Promise((resolve) => {
      const fileRef = ref(storage, uuid());
      uploadBytesResumable(fileRef, imageObj.imgFile).then(() => {
        getDownloadURL(fileRef).then((imageURLfromStorage) => {
          resolve(imageURLfromStorage);
        });
      }); 
    }));

    const imagesStorageLinks : string[] = await Promise.all(promises);

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

  async function handleSendClick(evt : React.MouseEvent<HTMLButtonElement>){
    evt.preventDefault();
    if(!inputValidation()) return;

    try{
      toggleWaitingSpinner();
      const imagesStorageLinks : string[] = await getUploadImagesLinks();
      const documentsStorageLinks : string[] = [];
      //const documentsStorageLinks = getUploadDocumentsLinks();
      l(`imagesStorageLinks : ${imagesStorageLinks.length}`);
      l(`documentsStorageLinks : ${documentsStorageLinks.length}`);

      saveMessage(imagesStorageLinks, documentsStorageLinks);
      updateLastMessageForUsers();
    }catch(e : any){
      l(e.message);
    }
    
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
    const imageFiles = evt.target.files;
    if(!imageFiles) return;

    const newImages : Array<TImage> = [];
    for(let i = 0; i < imageFiles.length; i++){
      newImages.push({
        imgFile: imageFiles.item(i)!,
        imgLink: URL.createObjectURL(imageFiles.item(i)!)
      });
    } 
    l(newImages);
    setState(prevState => ({
      ...prevState, 
      images: [
        ...prevState?.images, 
        ...newImages
      ]
    }));
  }

  function handleModalView(evt : React.MouseEvent<HTMLButtonElement>){
    evt.preventDefault();
    setState(prevState => ({
      ...prevState,
      isModalOpen: !prevState.isModalOpen
    }));
  }

  function clearSelectedFiles(listType : string){
    switch(listType){
      case "images":
        setState(prevState => ({
          ...prevState,
          isModalOpen: false,
          images: []
        }));
        imagesInputRef.current!.value = '';
        break;
      case "documents":
        setState(prevState => ({
          ...prevState,
          isModalOpen: false,
          documents: []
        }));
        documentsInputRef.current!.value = '';
        break;
      default:
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
        <input type="text" 
              className="chat-message-input" 
              placeholder='Type a message' 
              value={state?.text} 
              onChange={(e) => setState(prevState => ({...prevState, text: e.target.value}))}/>
        {/* {
          inputError &&
          <div className="chat-footer-error">
            {inputError}
          </div>
        } */}
        <div className="chat-message-actions-box">
          <label>
              <BsPaperclip className="btn chat-clip-doc"/>
              <input type="file" className="input-file" accept='.docx' onChange={handleDocumentChange} multiple ref={documentsInputRef}/>
              {
                state.documents.length > 0 &&
                <button className="chat-btn-preview-files" onClick={handleModalView}>{state.documents.length}</button>
              }
          </label>
          <label>
              <MdOutlineAddPhotoAlternate className="btn chat-clip-image"/>
              <input type="file" id="selected-imageg" className="input-file" accept='image/*' onChange={handleImageChange} ref={imagesInputRef} multiple/>
              {
                state.images.length > 0 &&
                <button className="chat-btn-preview-files" onClick={handleModalView}>{state.images.length}</button>
              }
          </label>
          {
            state.isSendClicked 
            ? <WaitingSpinner />
            : <button className="btn chat-btn-send-message" onClick={handleSendClick}>Send</button>
          }
        </div>

        <SelectedFiles modalState={state.isModalOpen} images={state.images} documents={state.documents} handleModalView={handleModalView} clearSelectedFiles={clearSelectedFiles} />
    </div>
  )
}
