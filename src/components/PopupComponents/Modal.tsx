
import { createPortal } from "react-dom";
import { useModalElement } from "../../hooks/hooks";
// import style from '../styles/SelectedFiles.module.css';

export default function Modal(props : any) {
    const { isOpen } = props;
    const modalElement = useModalElement();

    if(isOpen){
        modalElement.classList.add("modal-box");
        return createPortal(props.children, modalElement);
    }else{
        modalElement.classList.remove("modal-box");
        return null;
    } 
}
