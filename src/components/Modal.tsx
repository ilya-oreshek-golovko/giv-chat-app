
import { createPortal } from "react-dom";
import { useModalElement } from "../hooks/hooks";

export default function Modal(props : any) {
    const modalElement = useModalElement();
    return createPortal(props.children, modalElement);
}
