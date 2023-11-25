import { TConfirmationBox } from "../../types";

export default function ConfirmationBox(props : TConfirmationBox){
    const { handleRejectAction, handleConfirmAction } = props;
    return(
        <div className='confirmation-box'>
            <p className="confirmation-text">Are you sure you want to empty a list of selected files?</p>
            <div className="confirmation-btn-box">
                <button className="confirmation-btn positive" onClick={handleRejectAction}>Yes</button>
                <button className="confirmation-btn negative" onClick={handleConfirmAction}>No</button>
            </div>
        </div>
    )
}