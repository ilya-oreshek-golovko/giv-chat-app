import { SyntheticEvent, useRef, useState } from "react";
import { home, login } from "../routing";
import { registerWithEmailAndPassword } from "../firebase/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const navigation = useNavigate();

    const email = useRef() as React.RefObject<HTMLInputElement>;
    const password = useRef() as React.RefObject<HTMLInputElement>;
    const confrimPassword = useRef() as React.RefObject<HTMLInputElement>;

    type RegisterError = {
        emailError: string,
        passError: string,
        confirmPassError: string
    }
    const [stateErrors, setStateErrors] = useState<RegisterError>({
        emailError: "",
        passError: "",
        confirmPassError: ""
    });

    function validation(){
        if(!email.current?.value){
            setStateErrors({
                emailError: "Email is empty",
                passError: "",
                confirmPassError: ""
            });
            return false;
        }else if(!password.current?.value){
            setStateErrors({
                emailError: "",
                passError: "Password is empty",
                confirmPassError: ""
            });
            return false;
        }else if(!confrimPassword.current?.value){
            setStateErrors({
                emailError: "",
                passError: "",
                confirmPassError: "Confirm password please"
            });
            return false;
        } else if(confrimPassword.current?.value !== password.current?.value){
            setStateErrors({
                emailError: "",
                passError: "",
                confirmPassError: "Passwords don't match. Plese try again"
            });
            return false;
        }

        return true;
    }

    async function onFormSubmit(evt : SyntheticEvent<HTMLFormElement, SubmitEvent>){
        evt.preventDefault();

        if(!validation()){
            return null;
        }

        const result = await registerWithEmailAndPassword(email.current?.value!, password.current?.value!);
    
        if(typeof result !== "object"){
            alert(`Error: ${result}`);
            return;
        }
        //TODO need to save user
        navigation(home.replace(":key", email.current?.value!));
    }

    const ErrorHandler = ({message} : {message : string}) => {
        if(!message) return;

        return(
            <div className="auth-error-text">
                {message}
            </div>
        );
    }
    
    return (
      <form className="auth-box" onSubmit={onFormSubmit}>
          <h1 className="auth-box-title">GIV Chat</h1>
          <div className="auth-box-type">Register</div>
          <div className='input-field-box'>
            <input type="text" id="auth-email" className='input-field' ref={email} required/>
            <label htmlFor="auth-email" className="auth-input-label">Email</label>
            <ErrorHandler message={stateErrors.emailError}/>
          </div>
          <div className='input-field-box'>
            <input type="password" id="auth-password" className='input-field' ref={password}  required/>
            <label htmlFor="auth-password" className="auth-input-label">Password</label>
            <ErrorHandler message={stateErrors.passError}/>
          </div>
          <div className='input-field-box'>
            <input type="password" id="auth-repeat-password" className='input-field' ref={confrimPassword} required/>
            <label htmlFor="auth-repeat-password" className="auth-input-label">Repeat Pass</label>
            <ErrorHandler message={stateErrors.confirmPassError}/>
          </div>
          <input type="submit" value="Submit" className="auth-btn-submit"/>
          <p className="auth-footer-notice">
              You already have an account? <Link to={login} className="auth-nav-link">Login</Link>
          </p>
      </form>
    )
  }
  