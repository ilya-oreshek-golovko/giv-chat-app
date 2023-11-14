import React from 'react'
type TViewImageProps = {
  imageLink : string, 
  handleConfirmClick : React.MouseEventHandler<HTMLElement>,
  handleRejectClick? : React.MouseEventHandler<HTMLElement>,
  title: string
  labelConfirm?: string,
  labelReject?: string,
  roundedImage?: boolean
}

export default function ViewImage({imageLink, handleConfirmClick, handleRejectClick = undefined, title, labelConfirm = "Ok", labelReject = "Cancel", roundedImage = false} : TViewImageProps) {
  return (
    <div className='view-image-box'>
      <div className="view-image-header" onClick={handleConfirmClick}>
        <h2 className='view-image-title'>{title}</h2>
        <p className="btn-close-view-image">x</p>
      </div>
      <div className='view-image-content'>
        <img src={imageLink} alt="viewed-image" className={'viewed-image ' + (roundedImage ? 'rounded' : '')}/>
      </div>
      <div className="view-image-btn-box">
        <button className="btn btn-view-image confirm" onClick={handleConfirmClick}>{labelConfirm}</button>
        {
          handleRejectClick &&
          <button className="btn btn-view-image reject" onClick={handleRejectClick}>{labelReject}</button>
        }
      </div>
    </div>
  )
}
