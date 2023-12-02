import { useStoredChatFiles } from '../../hooks/hooks';
import { 
  useDocumentManagement, 
  useImagesManagement, 
  useInput, 
  useIntupModalManagement, 
  useSendManagement } from '../../hooks/InputHooks';

export default function Input() {

  const {inputText, InputComponent, setInputText}            = useInput();
  const {imgRef, images, setImages, ImagesComponent}         = useImagesManagement();
  const {docRef, documents, setDocuments, DocumentComponent} = useDocumentManagement();
  const {SendButton, handleSendClick}                        = useSendManagement({
    txtManagement : {inputText, setInputText},
    docManagement : {documents, setDocuments},
    imgManagement : {images, setImages}
  });
  const {handleModalView}                                    = useIntupModalManagement({
    setDocuments,
    setImages,
    docRef : docRef,
    imgRef : imgRef
  });

  useStoredChatFiles({inputText, setInputText});

  return (
    <div className="chat-footer">
      {
        InputComponent({
          handleConfirm : handleSendClick
        })
      }
      <div className="chat-message-actions-box">
        {
          ImagesComponent(handleModalView)
        }
        {
          DocumentComponent(handleModalView)
        }
        {
          SendButton()
        }
      </div>
    </div>
  )
}
