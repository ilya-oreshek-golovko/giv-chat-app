import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { SelectedFilesContext } from "../../context/SelectedFilesContext";
import { IMessage } from "../../interfaces";
import { useContext, useRef, useEffect, useState } from "react";
import { TDocument, TImage } from "../../types";
import Modal from "../Modal";
import ViewImage from "../ViewImage";
import {FcDocument} from 'react-icons/fc';
import { BsCheckAll, BsCheck } from 'react-icons/bs';
import React from "react";

type TViewImage = {
  isViewImage : boolean,
  imageLink: string
}

export default function Message({message, isReaded, handleMarkMessageAsReaded} : {message : IMessage, isReaded : boolean, handleMarkMessageAsReaded : Function}){

  const currentUser = useContext(AuthContext);
  const {currentChat}    = useContext(ChatContext);
  const {setSelectedFiles} = useContext(SelectedFilesContext);
  const [viewImageState, setViewImageState] = useState<TViewImage>({
    isViewImage : false,
    imageLink : ""
  });

  const imagesToView = 6;
  const docsToView = 6;

  const messageRef = useRef() as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    messageRef.current?.scrollIntoView();
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

//https://ru.w3docs.com/snippets/css/kak-mozhno-otobrazit-animirovannyi-tekst-na-izobrazhenii-pri-navedenii-myshi-s-pomoshchiu-css3.html
  return (
    <div key={message.id} className="chat-message" ref={messageRef}>
        <div className={"message-container " + (currentUser.uid == message.senderID ? "owner-message" : "friend-message")}>
          <div className="message-info">
            <img src={currentUser.uid == message.senderID ? currentUser.photoURL : currentChat.user.photoURL} alt="profile-img" className="message-profile-img" />
            <div className="message-date-time">{getMessageDate()}</div>
          </div>
          <div className="message-content">
            {
              message.text &&
              <p className={"message-content-text " + (currentUser.uid == message.senderID ? "owner-content" : "friend-content")}>
                {message.text}
              </p>
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
        <CheckOutput />
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