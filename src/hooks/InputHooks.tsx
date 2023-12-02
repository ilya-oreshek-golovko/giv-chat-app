import { ChangeEvent, KeyboardEvent, useContext, useRef, useState } from "react";
import WaitingSpinner from "../components/SpinnerComponents/WaitingSpinner";
import { ChatContext } from "../context/ChatContext";
import { InputFilesType, TDocument, TImage, TUseInputModalManagement, TUseSendManagement } from "../types";
import { IMessage, IUser } from "../interfaces";
import { AuthContext } from "../context/AuthContext";
import { Timestamp, arrayUnion } from "firebase/firestore";
import { addMessageToChat, updateChatHeader } from "../firebase/chat";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { v4 as uuid } from "uuid"; 
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { BsPaperclip } from "react-icons/bs";
import { SelectedFilesContext } from "../context/SelectedFilesContext";

const l = (mes : string) => console.log(mes);
type THandleModalView = ({images = [], documents = []} : {images? : Array<TImage>, documents? : Array<TDocument>}) => void;

function useInput(){

    const [inputText, setInputText] = useState<string>("");
    type TKeyInput = KeyboardEvent<HTMLTextAreaElement>;

    
    function validateUserInput(evt : TKeyInput) : boolean{
        if(!evt.shiftKey && evt.code == "Enter") return true;

        return false;
    }

    function handleTextChange(evt: ChangeEvent<HTMLTextAreaElement>): void {
        setInputText(evt.target.value);
    }

    function InputComponent({handleConfirm} : {handleConfirm :  () => void}){
        return(
            <div className="giv-test">
                <textarea 
                    className="chat-message-input" 
                    placeholder='Type a message' 
                    value={inputText}
                    onChange={handleTextChange}
                    onKeyDown={
                        (evt : TKeyInput) => validateUserInput(evt) && handleConfirm()
                        }/>
                <div className='giv-test-child'>{inputText}</div>
            </div>
        )
    }

    return{
        InputComponent,
        setInputText,
        inputText
    }
}

function useSendManagement({imgManagement, docManagement, txtManagement} : TUseSendManagement){

    const {currentChat} = useContext(ChatContext);
    const currentUser : IUser = useContext(AuthContext);
    const [showSpinner, setShowSpinner] = useState<boolean>(false);

    const {images, setImages} = imgManagement;
    const {documents, setDocuments} = docManagement;
    const {inputText, setInputText} = txtManagement;

    const toggleWaitingSpinner = () => {
        setShowSpinner(prevState => !prevState);
    }

    const inputValidation = () => {
        if(!currentChat.chatID){
          alert("*Cannot identify the related chat. Please select a friend");
          return false;
        }else if(!inputText && images.length == 0 && documents.length == 0){
          alert("*Please type a message or select a file/image");
          return false;
        }else if(!currentChat.user.uid){
          alert("*Cannot identify user ID. Please contact system administrator");
        }
    
        //setInputError("");
        return true;
    }

    const saveMessage = async (imagesStorageLinks : Array<string>, documentsStorageLinks : Array<string>) 
    : Promise<IMessage> => 
    {
    
        const message : IMessage = {
          senderID: currentUser.uid,
          text : inputText,
          images : imagesStorageLinks,
          documents : documentsStorageLinks,
          id: uuid(),
          date: Timestamp.now()
        };
    
        await addMessageToChat(message, currentChat.chatID); 
        l("Message saved");
    
        return message;
    }

    const updateLastMessageAndUnreaded = async (savedMessage : IMessage) => {
        if(!currentChat.chatID || !currentChat.user.uid){
          alert("Is is failed to update last message. Please contact system administrator");
          return;
        }
    
        const chatHeaderFriend = {
          [currentChat.chatID + ".lastMessage"] : savedMessage,
          [currentChat.chatID + ".unreadedMessages"] : arrayUnion(savedMessage.id)
        };
        const chatHeaderCurrentUser = {
          [currentChat.chatID + ".lastMessage"] : savedMessage,
        };
    
        await updateChatHeader(currentUser.uid, chatHeaderCurrentUser);
    
        await updateChatHeader(currentChat.user.uid, chatHeaderFriend);
    }

    const getFileName = (prefix : string) => {
        const currentdate = new Date();
        return prefix + 
              + currentdate.getDate().toString() 
              + (currentdate.getMonth()+1).toString() 
              + currentdate.getFullYear() + "_" 
              + currentdate.getHours()  
              + currentdate.getMinutes() 
              + currentdate.getSeconds();
    }

    const getUploadImagesLinks = async () : Promise<string[]> => {
        if(images.length == 0) return [];
    
        const promises : Promise<string>[] = images.map((imageObj : TImage) => new Promise((resolve) => {
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
    
    const getUploadDocumentsLinks = async () : Promise<string[]> => {
        if(documents.length == 0) return [];
    
        const promises : Promise<string>[] = documents.map( (docObj : TDocument) => new Promise((resolve) => {
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

    const clearInputFiels = () => {
        setImages([]);
        setDocuments([]);
        setInputText("");
    }

    const handleSendClick = async () => {
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

    const SendButton = () => {
        return(
            showSpinner
            ? <WaitingSpinner />
            : <button className="btn chat-btn-send-message" onClick={handleSendClick}>Send</button>
        )
    }

    return{
        SendButton,
        handleSendClick
    }
}

function useImagesManagement(){

    const [images, setImages] = useState<TImage[]>([]);
    const imagesInputRef = useRef() as React.RefObject<HTMLInputElement>;

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

        setImages([
            ...images, 
            ...newImages
        ]);
    }

    function ImagesComponent( handleModalView : THandleModalView ){
        return(
            <label>
                <MdOutlineAddPhotoAlternate className="btn chat-clip-image"/>
                <input type="file" id="selected-imageg" className="input-file" accept='image/*' onChange={handleImageChange} ref={imagesInputRef} multiple/>
                {
                images.length > 0 &&
                <button className="btn-chat-preview-files" onClick={() => handleModalView({images : images}) }>{images.length}</button>
                }
            </label>
        )
    }

    return{
        imgRef : imagesInputRef,
        images,
        setImages,
        ImagesComponent
    }
}

function useDocumentManagement(){
    const [documents, setDocuments] = useState<TDocument[]>([]);
    const documentsInputRef = useRef() as React.RefObject<HTMLInputElement>;

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
    
        setDocuments([
            ...documents, 
            ...newDocuments
        ]);
    }

    function DocumentComponent( handleModalView : THandleModalView ){
        return(
            <label>
                <BsPaperclip className="btn chat-clip-doc"/>
                <input type="file" className="input-file" accept='.docx' onChange={handleDocumentChange} ref={documentsInputRef} multiple/>
                {
                documents.length > 0 &&
                <button className="btn-chat-preview-files" onClick={() => handleModalView({documents : documents}) }>{documents.length}</button>
                }
            </label>
        )
    }

    return{
        docRef : documentsInputRef,
        documents,
        setDocuments,
        DocumentComponent
    }
}

function useIntupModalManagement({setImages, setDocuments, imgRef, docRef} : TUseInputModalManagement){

    const {setSelectedFiles, selectedFilesState} = useContext(SelectedFilesContext);

    const clearSelectedFiles = (filesType : string) => {
        switch(filesType){
          case InputFilesType.img:
            setImages([]);
            imgRef.current!.value = '';
            break;
          case InputFilesType.doc:
            setDocuments([]);
            docRef.current!.value = '';
            break;
          default:
            l("Error: unable to define list type to delete selected files");
        }
    
        setSelectedFiles(prevState => ({
          ...prevState,
          isOpen: false
        }));
    }

    const deleteSelectedFiles = (fileToDelete : any) => {
        const newImages = selectedFilesState.images.filter(image => image.imgLink !== fileToDelete.imgLink);
        setImages(newImages);
    }

    function handleModalView({images = [], documents = []} : {images? : Array<TImage>, documents? : Array<TDocument>}){
        setSelectedFiles({
          images,
          documents,
          isOpen: true,
          clearSelectedFiles,
          deleteSelectedFiles
        });
    }
    
    return{
        handleModalView
    }
}

export {
    useInput,
    useSendManagement,
    useImagesManagement,
    useDocumentManagement,
    useIntupModalManagement
}

