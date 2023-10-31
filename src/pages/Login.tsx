import { SyntheticEvent, useRef, useState } from "react";
import {logInWithEmailAndPassword} from '../firebase/auth';
import { useNavigate, Link } from "react-router-dom";
import { register as rRegister, start as rStart } from '../routing';
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Login() {
  const email = useRef() as React.RefObject<HTMLInputElement>;
  const password = useRef() as React.RefObject<HTMLInputElement>;
  type LoginError = {
    emailError: string,
    passError: string
  }

  const [modalView, setModalView] = useState<boolean>(false);
  const [stateErrors, setStateErrors] = useState<LoginError>({
    emailError: "",
    passError: ""
  });

  const navigation = useNavigate();

  function validation(){
    if(!email.current?.value){
      setStateErrors((state) => ({
        emailError: "Email is empty",
        passError: ""
      }));
      return false;
    }else if(!password.current?.value){
      setStateErrors((state) => ({
        emailError: "",
        passError: "Password is empty"
      }));
      return false;
    }

    return true;
  }

  async function onFormSubmit(evt : SyntheticEvent<HTMLFormElement, SubmitEvent>){
    evt.preventDefault();

    if(!validation()) {
      return null;
    };
    setModalView(prevState => !prevState);

    const result = await logInWithEmailAndPassword(email.current?.value!, password.current?.value!);
    
    setModalView(prevState => !prevState);
    
    if(typeof result !== "object"){
      alert(`Error: ${result}`);
      return;
    }
    navigation(rStart);
  }

  return (
    <form className="auth-box" onSubmit={onFormSubmit}>
        {
          modalView &&
          <Modal isOpen={modalView}>
              <LoadingSpinner />
          </Modal>
        }
        <h1 className="auth-box-title">GIV Chat</h1>
        <div className="auth-box-type">Login</div>
        <div className='input-field-box'>
            <input type="text" id="auth-email" className='input-field' ref={email} required/>
            <label htmlFor="auth-email" className="auth-input-label">Email</label>
            {
              stateErrors.emailError &&
              <div className="auth-error-text">
                {stateErrors.emailError}
              </div>
            }
        </div>
        <div className='input-field-box'>
            <input type="password" id="auth-password" className='input-field' ref={password} required />
            <label htmlFor="auth-password" className="auth-input-label">Password</label>
            {
              stateErrors.passError &&
              <div className="auth-error-text">
                {stateErrors.passError}
              </div>
            }
        </div>
        <input type="submit" value="Submit" className="auth-btn-submit"/>
        <p className="auth-footer-notice">
            You don't have an account? <Link to={rRegister} className="auth-nav-link">Register</Link>
        </p>
    </form>
  )
}
