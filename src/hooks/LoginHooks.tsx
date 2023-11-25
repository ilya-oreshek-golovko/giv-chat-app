import { useRef, useState } from "react";
import LoadingSpinner from "../components/SpinnerComponents/LoadingSpinner";
import Modal from "../components/PopupComponents/Modal";
import { TLoginError, TUseFormManagement } from "../types";
import { useNavigate } from "react-router-dom";
import { logInWithEmailAndPassword } from "../firebase/auth";
import { start as rStart } from '../routing';

export function useModalViewManagement(){
    const [modalView, setModalView] = useState<boolean>(false);
    
    function ModalComponent() {
        return (
            modalView &&
            <Modal isOpen={modalView}>
                <LoadingSpinner />
            </Modal>
        );
    }

    return {modalView, setModalView, ModalComponent}
}

export function useLoginErrorManagement(){
    const [stateErrors, setStateErrors] = useState<TLoginError>({
        emailError: "",
        passError: ""
    });

    function isValidationFailed(email : string | undefined, password : string | undefined){
        if(!email){
          setStateErrors({
            emailError: "Email is empty",
            passError: ""
          });
          return true;
        }else if(!password){
          setStateErrors({
            emailError: "",
            passError: "Password is empty"
          });
          return true;
        }
    
        return false;
    }

    return {stateErrors, isValidationFailed};
}

export function useFormManagement({ isValidationFailed, setModalView } : TUseFormManagement){

    const emailRef = useRef() as React.RefObject<HTMLInputElement>;
    const passwordRef = useRef() as React.RefObject<HTMLInputElement>;
    const navigation = useNavigate();

    async function onFormSubmit(evt : React.FormEvent<HTMLFormElement>){
        evt.preventDefault();
        const formDate = {
          email: emailRef.current?.value,
          password: passwordRef.current?.value
        }
    
        if(isValidationFailed(formDate.email, formDate.password)) return; 
    
        setModalView(prevState => !prevState);
    
        const result = await logInWithEmailAndPassword(formDate.email!, formDate.password!);
        
        setModalView(prevState => !prevState);
        
        if(typeof result !== "object"){
          alert(`Error: ${result}`);
          return;
        }
        navigation(rStart);
    }

    return {emailRef, passwordRef, onFormSubmit}
}