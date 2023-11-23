import { ChangeEvent, useContext, useRef } from 'react';
import { BsPaperclip } from 'react-icons/bs';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { IMessage, IUser } from '../../interfaces';
import { addMessageToChat, updateChatHeader } from '../../firebase/chat';
import { AuthContext } from '../../context/AuthContext';
import { getDownloadURL, list, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../../firebase/firebase';
import { ChatContext } from '../../context/ChatContext';
import { v4 as uuid } from "uuid"; 
import { Timestamp, arrayUnion, serverTimestamp } from 'firebase/firestore';
import WaitingSpinner from '../WaitingSpinner';
import { SelectedFilesContext } from '../../context/SelectedFilesContext';
import { TDocument, TImage } from '../../types';
import { useStoredChatFiles } from '../../hooks/hooks';

const l = (mes : any) => console.log("Input: ", mes);
export default function Input() {

  const currentUser : IUser = useContext(AuthContext);
  const chatData = useContext(ChatContext);
  const imagesInputRef = useRef() as React.RefObject<HTMLInputElement>;
  const documentsInputRef = useRef() as React.RefObject<HTMLInputElement>;

  const {setSelectedFiles} = useContext(SelectedFilesContext);

  const {state, setState} = useStoredChatFiles(chatData);
  
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
      isSendClicked : false
    });
    imagesInputRef.current!.value = '';
    documentsInputRef.current!.value = '';
  }
  
  
  function inputValidation(){
    if(!chatData?.currentChat?.chatID){
      alert("*Cannot identify the related chat. Please select a friend");
      //setInputError("*Please type a message or select a file/image");
      return false;
    }else if(!state.text && state.images.length == 0 && state.documents.length == 0){
      alert("*Please type a message or select a file/image");
      //setInputError("*Cannot identify the related chat. Please contact sysadmin");
      return false;
    }else if(!chatData?.currentChat?.user.uid){
      alert("*Cannot identify user ID. Please contact system administrator");
    }

    //setInputError("");
    return true;
  }
  
  async function saveMessage(imagesStorageLinks : Array<string>, documentsStorageLinks : Array<string>) : Promise<IMessage>{
    
    const message : IMessage = {
      senderID: currentUser.uid,
      text : state.text,
      images : imagesStorageLinks,
      documents : documentsStorageLinks,
      id: uuid(),
      date: Timestamp.now()
    };

    // const newUnreaded : IUnreadedMessages = {
    //   [message.id] : [chatData?.currentChat?.user.uid!]
    // };

    await addMessageToChat(message, chatData?.currentChat?.chatID!); 
    l("Message saved");

    return message;
  }

  function getLastMessage(){
    if(state.text) return state.text;
    
    return "attached"
  }

  async function updateLastMessageAndUnreaded(savedMessage : IMessage) {
    if(!chatData.currentChat.chatID || !chatData.currentChat.user.uid){
      alert("Is is failed to update last message. Please contact system administrator");
      return;
    }

    //const lastMessage = getLastMessage();

    const chatHeaderFriend = {
      [chatData.currentChat.chatID + ".lastMessage"] : savedMessage,
      //[chatData.currentChat.chatID + ".lastMessageDate"] : serverTimestamp(),
      [chatData.currentChat.chatID + ".unreadedMessages"] : arrayUnion(savedMessage.id)
      //[chatData.currentChat.chatID + ".unreadedMessages"] : arrayUnion(savedMessage)
    };
    const chatHeaderCurrentUser = {
      [chatData.currentChat.chatID + ".lastMessage"] : savedMessage,
      //[chatData.currentChat.chatID + ".lastMessageDate"] : serverTimestamp(),
    };

    await updateChatHeader(currentUser.uid, chatHeaderCurrentUser);

    await updateChatHeader(chatData.currentChat.user.uid, chatHeaderFriend);
  }

  function getFileName(prefix : string){
    const currentdate = new Date();
    return prefix + 
          + currentdate.getDate().toString() 
          + (currentdate.getMonth()+1).toString() 
          + currentdate.getFullYear() + "_" 
          + currentdate.getHours()  
          + currentdate.getMinutes() 
          + currentdate.getSeconds();
  }

  async function getUploadImagesLinks() : Promise<string[]>{
    if(state.images.length == 0) return [];

    const promises : Promise<string>[] = state.images.map((imageObj : TImage) => new Promise((resolve) => {
      const fileRef = ref(storage, getFileName("img_"));
      uploadBytesResumable(fileRef, imageObj.imgFile!).then(() => {
        getDownloadURL(fileRef).then((imageURLfromStorage) => {
          resolve(imageURLfromStorage);
        });
      }); 
    }));

    const imagesStorageLinks : string[] = await Promise.all(promises);

    return imagesStorageLinks;
  }

  async function getUploadDocumentsLinks() : Promise<string[]> {
    if(state.documents.length == 0) return [];

    const promises : Promise<string>[] = state.documents.map( (docObj : TDocument) => new Promise((resolve) => {
      const fileRef = ref(storage, getFileName("doc_"));
      uploadBytesResumable(fileRef, docObj.docFile!).then(() => {
          getDownloadURL(fileRef).then((docURLfromStorage) => {
            resolve(docURLfromStorage);
          });
      });
    })); 
    
    const documentsStorageLinks : Array<string> = await Promise.all(promises);

    return documentsStorageLinks;
  }

  async function handleSendClick(){

    if(!inputValidation()) return;

    try{
      toggleWaitingSpinner();
      const imagesStorageLinks : string[] = await getUploadImagesLinks();
      const documentsStorageLinks : string[] = await getUploadDocumentsLinks();

      // l(`imagesStorageLinks : ${imagesStorageLinks.length}`);
      // l(`documentsStorageLinks : ${documentsStorageLinks.length}`);

      saveMessage(imagesStorageLinks, documentsStorageLinks).then(savedMessage => {
        updateLastMessageAndUnreaded(savedMessage);
      });
    }catch(e : any){
      l(e.message);
    }
    
    clearInputFiels();
  }

  function handleDocumentChange(evt : ChangeEvent<HTMLInputElement>){
    const documentsFile = evt.target.files;
    if(!documentsFile) return;

    const newDocuments : TDocument[] = [];
    for(let i = 0; i < documentsFile.length; i++){
      newDocuments.push({
        docFile : documentsFile[i], 
        docLink : URL.createObjectURL(documentsFile[i])
      });
    }

    const newState = {
      ...state, 
      documents: [
        ...state?.documents, 
        ...newDocuments
      ]
    }
    setState(newState);
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
    const newState = {
      ...state, 
      images: [
        ...state?.images, 
        ...newImages
      ]
    }
    setState(newState);
  }

  function handleModalView({images = [], documents = []} : {images? : Array<TImage>, documents? : Array<TDocument>}){
    const clearSelectedFiles = (listType : string) => {
      switch(listType){
        case "images":
          setState(prevState => ({
            ...prevState,
            images: []
          }));
          imagesInputRef.current!.value = '';
          break;
        case "documents":
          setState(prevState => ({
            ...prevState,
            documents: []
          }));
          documentsInputRef.current!.value = '';
          break;
        default:
          l("Error: unable to define list type to delete selected files");
      }
  
      setSelectedFiles(prevState => ({
        ...prevState,
        isOpen: false
      }));
    }

    const deleteSelectedFiles = (deletedImage : TImage) => {
      const newImages = state.images.filter(image => image.imgLink !== deletedImage.imgLink);
      setState(prevState => ({
        ...prevState,
        images: newImages
      }));
    }

    setSelectedFiles({
      images,
      documents,
      isOpen: true,
      clearSelectedFiles,
      deleteSelectedFiles
    });
  }


  function handleUserInput(evt : React.KeyboardEvent<HTMLInputElement>){
    evt.code == "Enter" && handleSendClick();
  }

  function handleTextChange(evt: ChangeEvent<HTMLInputElement>): void {
    setState(prevState => ({
      ...prevState, 
      text: evt.target.value
    }))
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
              onChange={handleTextChange}
              onKeyDown={handleUserInput}/>
        {/* {
          inputError &&
          <div className="chat-footer-error">
            {inputError}
          </div>
        } */}
        <div className="chat-message-actions-box">
          <label>
              <BsPaperclip className="btn chat-clip-doc"/>
              <input type="file" className="input-file" accept='.docx' onChange={handleDocumentChange} ref={documentsInputRef} multiple/>
              {
                state.documents.length > 0 &&
                <button className="btn-chat-preview-files" onClick={() => handleModalView({documents : state.documents}) }>{state.documents.length}</button>
              }
          </label>
          <label>
              <MdOutlineAddPhotoAlternate className="btn chat-clip-image"/>
              <input type="file" id="selected-imageg" className="input-file" accept='image/*' onChange={handleImageChange} ref={imagesInputRef} multiple/>
              {
                state.images.length > 0 &&
                <button className="btn-chat-preview-files" onClick={() => handleModalView({images : state.images}) }>{state.images.length}</button>
              }
          </label>
          {
            state.isSendClicked 
            ? <WaitingSpinner />
            : <button className="btn chat-btn-send-message" onClick={handleSendClick}>Send</button>
          }
        </div>
    </div>
  )
}
