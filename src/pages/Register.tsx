import { ChangeEvent, SyntheticEvent, useRef, useState } from "react";
import { home, login } from "../routing";
import { registerWithEmailAndPassword, uploadFileTest } from "../firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { RegisterError } from "../types";
import { ImFilePicture } from "react-icons/im"

export default function Register() {
    const navigation = useNavigate();

    const userName = useRef() as React.RefObject<HTMLInputElement>;
    const email = useRef() as React.RefObject<HTMLInputElement>;
    const password = useRef() as React.RefObject<HTMLInputElement>;
    const confrimPassword = useRef() as React.RefObject<HTMLInputElement>;

    const [stateErrors, setStateErrors] = useState<RegisterError>({
        userName: "",
        emailError: "",
        passError: "",
        confirmPassError: ""
    });

    function validation(){
        if(!userName.current?.value){
            setStateErrors({
                userName: "Name is empty",
                emailError: "",
                passError: "",
                confirmPassError: ""
            });
            return false;
        } else if(!email.current?.value){
            setStateErrors({
                emailError: "Email is empty",
                userName: "",
                passError: "",
                confirmPassError: ""
            });
            return false;
        }else if(!password.current?.value){
            setStateErrors({
                emailError: "",
                userName: "",
                passError: "Password is empty",
                confirmPassError: ""
            });
            return false;
        }else if(!confrimPassword.current?.value){
            setStateErrors({
                emailError: "",
                userName: "",
                passError: "",
                confirmPassError: "Confirm password please"
            });
            return false;
        } else if(confrimPassword.current?.value !== password.current?.value){
            setStateErrors({
                emailError: "",
                userName: "",
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
        if(!message) return null;

        return(
            <div className="auth-error-text">
                {message}
            </div>
        );
    }
    
    function testGiv(event: ChangeEvent<HTMLInputElement>): void {
        console.log(event.target.files);
        if(!event.target.files) return;
        uploadFileTest(event.target.files[0]); 
    }

    return (
      <form className="auth-box" onSubmit={onFormSubmit}>
          <h1 className="auth-box-title">GIV Chat</h1>
          <div className="auth-box-type">Register</div>
          <div className='input-field-box'>
            <input type="text" id="auth-name" className='input-field' ref={userName} required/>
            <label htmlFor="auth-name" className="auth-input-label">Name</label>
            <ErrorHandler message={stateErrors.userName}/>
          </div>
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
          <label className="input-file-desctop">
            <ImFilePicture className="profile-img"/>
            Choose your avatar
            <input type="file" className="input-file" onChange={testGiv}/>
          </label>
          <input type="submit" value="Submit" className="auth-btn-submit"/>
          <p className="auth-footer-notice">
              You already have an account? <Link to={login} className="auth-nav-link">Login</Link>
          </p>
      </form>
    )
  }
  