import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { SelectedFilesContext } from "../../context/SelectedFilesContext";
import { useContext, useRef, useEffect, useState, memo } from "react";
import { ContextEvents, TContextMenu, TDocument, TImage, TMessage } from "../../types";
import Modal from "../PopupComponents/Modal";
import ViewImage from "../PopupComponents/ViewImage";
import {FcDocument} from 'react-icons/fc';
import { BsCheckAll, BsCheck } from 'react-icons/bs';
import React from "react";
import { useInput } from "../../hooks/InputHooks";
import { IMessage } from "../../interfaces";

type TViewImage = {
  isViewImage : boolean,
  imageLink: string
}

function Message({message, isReaded, handleMarkMessageAsReaded, handleRightClick, scrollState, ContextMenuState} : TMessage){

  // console.log(`Message ${message.id}`);

  const currentUser = useContext(AuthContext);
  const {currentChat}    = useContext(ChatContext);
  const {setSelectedFiles} = useContext(SelectedFilesContext);

  const [viewImageState, setViewImageState] = useState<TViewImage>({
    isViewImage : false,
    imageLink : ""
  });

  const {InputComponent, setInputText, inputText} = useInput();

  const imagesToView = 6;
  const docsToView = 6;

  const messageRef = useRef() as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    if(scrollState.ScrollIntoView) messageRef.current?.scrollIntoView();
    else if(scrollState.lastMessageinSlice?.id == message.id) {
      messageRef.current?.scrollIntoView();
    }
  
    if(isReaded || message.senderID == currentUser.uid) return;

    handleMarkMessageAsReaded(message.id);
  }, [message]);

  function getMessageDate(){
    const mDate = message.date.toDate();
    return `${mDate.getDate()}.${mDate.getMonth()+1}.${mDate.getFullYear()}`;
  }

  function handleViewAllFiles(evt : React.MouseEvent<HTMLElement>){
    evt.preventDefault();
    setSelectedFiles({
      images: message.images.map(imageLink => ({imgLink: imageLink} as TImage)),
      documents: message.documents.map(docLink => ({docLink: docLink} as TDocument)),
      isOpen: true
    });
  }

  function handleMessageImageClick(imageLink : string){
    setViewImageState({
      isViewImage: true,
      imageLink
    });
  }

  const ImagesOutput = () => {
    const imagesForOutput = [];
    for(let i = 0; i < imagesToView; i++){
      if(!message.images[i]) break;
      imagesForOutput.push(message.images[i]);
    }
    // const imagesForOutput = message.images.splice(0, imagesToView);
    return(
      <div className="message-content-files-container">
        <div className={"message-content-files " + (currentUser.uid == message.senderID ? "owner-content" : "friend-content")}>
          {
            imagesForOutput.map((imageLink : string) => (
              <div className="message-file-container" key={imageLink}>
                <img src={imageLink} alt="message-img" className="message-file" onClick={() => handleMessageImageClick(imageLink)}/>
              </div>
            ))    
          }
          {
            message.images.length >= imagesToView &&
            <p className="btn-view-all-files" onClick={handleViewAllFiles}>View All Images</p>
          }
        </div>
      </div>
    )
  }

  const DocumentsOutput = () => {
    const documentsForOutput = [];
    for(let i = 0; i < docsToView; i++){
      if(!message.documents[i]) break;
      documentsForOutput.push(message.documents[i]);
    }

    return(
      <div className="message-content-files-container">
        <div className={"message-content-files " + (currentUser.uid == message.senderID ? "owner-content" : "friend-content")}>
          {
            documentsForOutput.map((documentLink : string) => (
              <div className="message-file-container" key={documentLink}>
                <a href={documentLink} target="_blank" className="message-link-download-file">
                  <FcDocument className="message-file document" />
                </a>
              </div>
            ))    
          }
          {
            message.documents.length >= docsToView &&
            <p className="btn-view-all-files" onClick={handleViewAllFiles}>View All Documents</p>
          }
        </div>
      </div>
    )
  }

  const CheckOutput = () => {
    if(currentUser.uid != message.senderID) return null;

    return(
      <div className="message-read-status">
          {
            isReaded
            ?
            <BsCheckAll />
            :
            <BsCheck />
          }
      </div>
    )
  }

  const InputOutput = () => {
    return(
      ContextMenuState?.targetEvent == ContextEvents.edit
      ?
      InputComponent({handleConfirm : () => {}})
      :
      (
        message.text &&
        <p className={"message-content-text " + (currentUser.uid == message.senderID ? "owner-content" : "friend-content")}>
          {message.text}
          <CheckOutput />
        </p>
      )
    )
  }

  function handleContextClick(evt: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    evt.preventDefault();
    // console.log(`top = ${evt.pageY}`);
    // console.log(`left = ${evt.pageX}`);
    if(message.senderID != currentUser.uid) return;
    handleRightClick(evt.pageY, evt.pageX, message.id, message.senderID, isReaded);
  }

//https://ru.w3docs.com/snippets/css/kak-mozhno-otobrazit-animirovannyi-tekst-na-izobrazhenii-pri-navedenii-myshi-s-pomoshchiu-css3.html
  return (
    <div key={message.id} className="chat-message" ref={messageRef} onContextMenu={handleContextClick}>
        <div className={"message-container " + (currentUser.uid == message.senderID ? "owner-message" : "friend-message")}>
          <div className="message-info">
            <img src={currentUser.uid == message.senderID ? currentUser.photoURL : currentChat.user.photoURL} alt="profile-img" className="message-profile-img" />
            <div className="message-date-time">{getMessageDate()}</div>
          </div>
          <div className="message-content">
            {
              InputOutput()
            }
            {
              message.images?.length > 0 &&
              <ImagesOutput />
            }
            {
              message.documents?.length > 0 &&
              <DocumentsOutput />
            }
          </div>
        </div>
        {
            viewImageState.isViewImage &&
            <Modal isOpen={viewImageState.isViewImage}>
                <ViewImage 
                  imageLink={viewImageState.imageLink} 
                  handleConfirmClick={() => setViewImageState(prevState => ({...prevState, isViewImage: false}))}
                  title={"file"}
                />
            </Modal>
        }
    </div>
  )
}

export default memo(Message, (prevProps : TMessage, nextProps : TMessage) => {
  if(
    prevProps.message != nextProps.message ||
    prevProps.isReaded != nextProps.isReaded ||
    prevProps.scrollState != nextProps.scrollState ||
    (
      prevProps.ContextMenuState.isOpen != nextProps.ContextMenuState.isOpen &&
      (
        nextProps.ContextMenuState.targetMessage == nextProps.message.id 
        ||
        [ContextEvents.edit, ContextEvents.delete].includes(nextProps.ContextMenuState.targetEvent!)
      )
    )
  ){
    return false;
  }

  return true;
});