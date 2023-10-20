import React, { MouseEventHandler, useState } from 'react'
import { TDocument, TImage } from './Input';
import Modal from '../Modal';
import {FcDocument} from 'react-icons/fc';

type TSelectedFiles = {
    images: Array<TImage>,
    documents: Array<TDocument>,
    handleModalView: MouseEventHandler<HTMLButtonElement>,
    clearSelectedFiles: Function,
    modalState: boolean
}
export default function SelectedFiles(props : TSelectedFiles) {
    const { images, documents, handleModalView, clearSelectedFiles, modalState } = props;

    const [modalView, setModalView] = useState<boolean>(false);
    const listType = images.length > 0 ? "images" : "documents";

    function handleDeleteAction(evt : React.MouseEvent<HTMLButtonElement>) {
        evt.preventDefault();
        clearSelectedFiles(listType);
        setModalView(false);
    }

  return (
    <div className={'selected-files-box' + (modalState ? ' open' : '')}>
        <h2 className='selected-files-header'>{ listType }</h2>
        <div className='selected-files-items-box'>
            {
                images.length > 0 &&
                images.map((image : TImage) => 
                    <div className="selected-files-item">
                        <img src={image.imgLink} alt="img-preview" className="selected-files-type image" />
                        <p className="selected-file-description">Name: {image.imgFile?.name}</p>
                    </div>
                )
            }
            {
                documents.length > 0 &&
                documents.map((document : TDocument) => 
                    <div className="selected-files-item">
                        <FcDocument className="selected-files-type document" />
                        <p className="selected-file-description">Name: {document.docFile?.name}</p>
                    </div>
                )
            }
        </div>
        <div className="selected-files-btn-box">
            <button className="selected-files-btn confirmation" onClick={handleModalView}>Ok</button>
            <button className="selected-files-btn delete" onClick={() => setModalView(true)}>Delete</button>
        </div>  
        {
            modalView &&
            <Modal isOpen={modalView}>
                <ConfirmationBox handleDeleteAction={handleDeleteAction} handleConfirmAction={() => setModalView(false)}/>
            </Modal>
        }
    </div>
  )
}
type TConfirmationBox = {
    handleDeleteAction : React.MouseEventHandler<HTMLButtonElement>,
    handleConfirmAction : React.MouseEventHandler<HTMLButtonElement>,
}
function ConfirmationBox(props : TConfirmationBox){
    const { handleDeleteAction, handleConfirmAction } = props;
    return(
        <div className='confirmation-box'>
            <p className="confirmation-text">Are you sure you want to empty a list of selected files?</p>
            <div className="confirmation-btn-box">
                <button className="confirmation-btn positive" onClick={handleDeleteAction}>Yes</button>
                <button className="confirmation-btn negative" onClick={handleConfirmAction}>No</button>
            </div>
        </div>
    )
}
