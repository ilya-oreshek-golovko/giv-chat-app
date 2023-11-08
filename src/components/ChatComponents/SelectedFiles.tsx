import React, { MouseEventHandler, useContext, useState } from 'react'
import { TDocument, TImage } from '../../types';
import Modal from '../Modal';
import {FcDocument} from 'react-icons/fc';
import { SelectedFilesContext, TSelectedFilesState } from '../../context/SelectedFilesContext';
import ViewImage from '../ViewImage';

type ModalState = {
    isModalOpen : boolean,
    componentToRender : any
}
export default function SelectedFiles() {
    const {stateF, setStateF} = useContext(SelectedFilesContext);
    const {images, documents, isOpen, clearSelectedFiles} = stateF;

    const [modalState, setModalState] = useState<ModalState>({
        isModalOpen: false,
        componentToRender: ""
    });
    const listType = images.length > 0 ? "images" : "documents";

    function closeSelectedFiles(){
        setStateF((prevState : TSelectedFilesState) => ({
            ...prevState,
            isOpen: false
        }));
    }

    function handleDeleteAction(evt : React.MouseEvent<HTMLButtonElement>) {
        evt.preventDefault();
        if(clearSelectedFiles) clearSelectedFiles(listType);
        closeSelectedFiles();
        setModalState(prevState => ({...prevState, isModalOpen : false}));
    }

    function handleImageClick(imageLink : string, imageName : string | undefined){
        setModalState({
            componentToRender: (
                <ViewImage 
                    imageLink={imageLink} 
                    handleConfirmClick={() => setModalState(prevState => ({...prevState, isModalOpen: false}))}
                    handleRejectClick={() => {}}
                    title={imageName ? imageName : "file"}
                />
            ), 
            isModalOpen : true
        });
    }

    function handleDeleteClick(){
        setModalState({
            componentToRender: <ConfirmationBox handleDeleteAction={handleDeleteAction} handleConfirmAction={() => setModalState(prevState => ({...prevState, isModalOpen : false})) }/>, 
            isModalOpen : true
        });
    }

  return (
    <div className={'selected-files-box' + (isOpen ? ' open' : '')}>
        <h2 className='selected-files-header'>{ listType }</h2>
        <div className='selected-files-items-box'>
            {
                images.length > 0 &&
                images.map((image : TImage) => 
                    <div className="selected-files-item" key={image.imgLink}>
                        <div className='selected-files-image-box'>
                            <div className="selected-files-item-view-option">V</div>
                            <div className="selected-files-item-delete-option">D</div>
                            <img src={image.imgLink} alt="img-preview" className="selected-files-type image" onClick={() => handleImageClick(image.imgLink, image.imgFile?.name)}/>
                        </div>
                        {
                            image.imgFile &&
                            <p className="selected-file-description">Name: {image.imgFile.name}</p>
                        }
                    </div>
                )
            }
            {
                documents.length > 0 &&
                documents.map((document : TDocument) => 
                    <div className="selected-files-item" key={document.docLink}>
                        <FcDocument className="selected-files-type document" />
                        {
                            document.docFile &&
                            <p className="selected-file-description">Name: {document.docFile.name}</p>
                        }
                    </div>
                )
            }
        </div>
        <div className="selected-files-btn-box">
            <button className="selected-files-btn confirmation" onClick={(evt) => closeSelectedFiles()}>Ok</button>
            {
                clearSelectedFiles &&
                <button className="selected-files-btn delete" onClick={() => handleDeleteClick()}>Delete</button>
            }
        </div>  
        {
            modalState.isModalOpen &&
            <Modal isOpen={modalState.isModalOpen}>
                {modalState.componentToRender}
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
