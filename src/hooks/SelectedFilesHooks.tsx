import { SetStateAction, useState } from "react";
import { TImage, TModalView, TSelectedFilesState, TUseActionManagement, TUseImagesManagement } from "../types";
import Modal from "../components/PopupComponents/Modal";
import ConfirmationBox from '../components/PopupComponents/ConfirmationBox';
import ViewImage from "../components/PopupComponents/ViewImage";

function useModalManagement(){

    const [modalState, setModalState] = useState<TModalView>({
        isOpen: false,
        children: null
    });

    function closeModal(){
        setModalState({children: null, isOpen : false});
    }

    function ModalComponent(){
        return(
            modalState.isOpen &&
            <Modal isOpen={modalState.isOpen}>
                {modalState.children}
            </Modal>
        )
    }

    return{
        ModalComponent,
        closeModal,
        setModalState
    }
}

function useActionManagement({setModalState, clearSelectedFiles, setSelectedFiles, filesType, closeModal} : TUseActionManagement){

    function closeSelectedFiles(){
        setSelectedFiles(prevState => ({
            ...prevState,
            isOpen: false
        }));
    }

    function handleConfirmAction(){
        setModalState(prevState => ({...prevState, isOpen : false}));
    }

    function handleRejectAction(){
        if(clearSelectedFiles) clearSelectedFiles(filesType);
        closeSelectedFiles();
        closeModal();
    }

    function showConfirmationBox(){
        setModalState({
            children: <ConfirmationBox 
                handleRejectAction={ () => handleRejectAction() }
                handleConfirmAction={() => handleConfirmAction()}/>, 
            isOpen : true
        });
    }

    function ActionButtons(){
        return(
            <div className="selected-files-btn-box">
                <button className="selected-files-btn confirmation btn" onClick={() => closeSelectedFiles()}>Ok</button>
                {
                    clearSelectedFiles &&
                    <button className="selected-files-btn delete btn" onClick={() => showConfirmationBox()}>Delete</button>
                }
            </div> 
        )
    }

    return{
        ActionButtons
    }
}

function useImagesManagement({setModalState, closeModal, deleteSelectedFiles, setSelectedFiles, images} : TUseImagesManagement){

    function handleImageClick(image : TImage){
        const imageName = image.imgFile?.name || "file";
        setModalState({
            children: (
                <ViewImage 
                    imageLink={image.imgLink} 
                    handleConfirmClick={() => closeModal()}
                    handleRejectClick={() => { 
                        if(deleteSelectedFiles){
                            deleteSelectedFiles(image);
                            const newImages = images.filter(iterableImage => iterableImage.imgLink !== image.imgLink)
                            setSelectedFiles(prevState => ({
                                ...prevState,
                                images: newImages
                            }));
                            closeModal();
                        }
                        else console.log("Can not delete selected file");
                    }}
                    title={imageName}
                    labelReject='Delete'
                />
            ), 
            isOpen : true
        });
    }

    function ImagesComponent(){
        return(
            images.length > 0 &&
            images.map((image : TImage) => 
                <div className="selected-files-item" key={image.imgLink}>
                    <div className='selected-files-image-box'>
                        {/* <div className="selected-files-options">
                            <div className="selected-files-option view">V</div>
                            <div className="selected-files-option delete">D</div>
                        </div> */}
                        <img src={image.imgLink} alt="img-preview" className="selected-files-type image" onClick={() => handleImageClick(image)}/>
                    </div>
                    {
                        image.imgFile &&
                        <p className="selected-file-description">Name: {image.imgFile.name}</p>
                    }
                </div>
            )
        )
    }

    return{
        ImagesComponent
    }
}

export {
    useModalManagement,
    useActionManagement,
    useImagesManagement
}