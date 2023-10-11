import React from 'react'
import { TDocument, TImage } from './Input';

type TSelectedFiles = {
    images: Array<TImage>,
    documents: Array<TDocument>
}
export default function SelectedFiles(props : TSelectedFiles) {
    const { images, documents } = props;
  return (
    <div className='selected-files-box'>
        {
            images.length > 0 &&
            images.map((image : TImage, index : number) => 
                <div className="selected-files-item">
                    <img src={image.imgLink} alt="img-preview" className="selected-files-img" />
                    <p className="selected-file-number">{index + 1}</p>
                </div>
            )
        }
        {
            documents.length > 0 &&
            <div>documents</div>
        }
    </div>  
  )
}
