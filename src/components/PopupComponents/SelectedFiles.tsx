import { useContext } from 'react'
import { InputFilesType, TDocument } from '../../types';
import {FcDocument} from 'react-icons/fc';
import { SelectedFilesContext } from '../../context/SelectedFilesContext';
import { useActionManagement, useImagesManagement, useModalManagement } from '../../hooks/SelectedFilesHooks';

export default function SelectedFiles() {

    const {selectedFilesState, setSelectedFiles} = useContext(SelectedFilesContext);
    const {images, documents, isOpen, clearSelectedFiles, deleteSelectedFiles} = selectedFilesState;

    const filesType = images.length > 0 ? InputFilesType.img : InputFilesType.doc;

    const { ModalComponent, closeModal, setModalState } = useModalManagement();
    const { ActionButtons } = useActionManagement({setModalState, clearSelectedFiles, setSelectedFiles, filesType, closeModal});
    const { ImagesComponent } = useImagesManagement({setModalState, closeModal, deleteSelectedFiles, setSelectedFiles, images});

  return (
    <div className={'selected-files-box' + (isOpen ? ' open' : '')}>
        <h2 className='selected-files-header'>{ filesType }</h2>
        <div className='selected-files-items-box'>
            {
                ImagesComponent()
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
        {
            ActionButtons()
        } 
        {
            ModalComponent()
        }
    </div>
  )
}
