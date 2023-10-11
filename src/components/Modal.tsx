
import { createPortal } from "react-dom";
import { useModalElement } from "../hooks/hooks";

export default function Modal(props : any) {
    const { isOpen } = props;
    const modalElement = useModalElement();

    if(isOpen) return createPortal(props.children, modalElement);
    else return null;
}
