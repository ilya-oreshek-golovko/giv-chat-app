import { ChangeEvent, SyntheticEvent, useRef, useState } from "react";
import { login } from "../routing";
import { addUser, registerWithEmailAndPassword } from "../firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { RegisterError } from "../types";
import { ImFilePicture } from "react-icons/im"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {updateProfile} from 'firebase/auth';
import { storage } from "../firebase/firebase";

export default function Register() {
    const navigation = useNavigate();

    const userNameRef = useRef() as React.RefObject<HTMLInputElement>;
    const emailRef = useRef() as React.RefObject<HTMLInputElement>;
    const passwordRef = useRef() as React.RefObject<HTMLInputElement>;
    const confrimPasswordRef = useRef() as React.RefObject<HTMLInputElement>;
    //const photoFileRef = useRef() as React.RefObject<HTMLInputElement>;
    let photoFile : File;
    const l = (mes : any) => console.log(mes);

    const [stateErrors, setStateErrors] = useState<RegisterError>({
        userNameError: "",
        emailError: "",
        passError: "",
        confirmPassError: ""
    });

    function getValidationResult(){
        const getResult = (result : boolean = false) => {
            if(result){
                return [userNameRef.current?.value, emailRef.current?.value, passwordRef.current?.value];
            }

            return [null, null, null];
        }

        if(!userNameRef.current?.value){
            setStateErrors({
                userNameError: "Name is empty",
                emailError: "",
                passError: "",
                confirmPassError: ""
            });
            return getResult();
        } else if(!emailRef.current?.value){
            setStateErrors({
                emailError: "emailRef is empty",
                userNameError: "",
                passError: "",
                confirmPassError: ""
            });
            return getResult();
        }else if(!passwordRef.current?.value){
            setStateErrors({
                emailError: "",
                userNameError: "",
                passError: "passwordRef is empty",
                confirmPassError: ""
            });
            return getResult();
        }else if(!confrimPasswordRef.current?.value){
            setStateErrors({
                emailError: "",
                userNameError: "",
                passError: "",
                confirmPassError: "Confirm passwordRef please"
            });
            return getResult();
        } else if(confrimPasswordRef.current?.value !== passwordRef.current?.value){
            setStateErrors({
                emailError: "",
                userNameError: "",
                passError: "",
                confirmPassError: "Passwords don't match. Plese try again"
            });
            return getResult();
        }

        return getResult(true);
    }

    async function onFormSubmit(evt : SyntheticEvent<HTMLFormElement, SubmitEvent>){
        evt.preventDefault();
  
        const [userName, email, password] = getValidationResult();

        if(!userName || !email || !password || !photoFile){
            return null;
        }
        l(`${userName} - ${email} - ${password} - ${photoFile}`);
        const res = await registerWithEmailAndPassword(email, password);
    
        if(typeof res !== "object"){
            alert(`Error: ${res}`);
            return;
        }
        l("Test 0");
        //Create a unique image name
        const date = new Date().getTime();
        const storageRef = ref(storage, `${userName + date}`);
        l(storageRef);
        await uploadBytesResumable(storageRef, photoFile).then(() => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
            try {
                l("Test 1");
                //Update profile
                await updateProfile(res.user, {
                    displayName : userName,
                    photoURL: downloadURL,
                });
                l("Test 2");

                await addUser({
                    uid: res.user.uid,
                    name: userName,
                    photoURL: downloadURL,
                    email
                });
                
                navigation("/");
                // //create user on firestore
                // await setDoc(doc(db, "users", res.user.uid), {
                //     uid: res.user.uid,
                //     userName,
                //     email,
                //     photoURL: downloadURL,
                // });
                // l("Test 3");
                // //create empty user chats on firestore
                // await setDoc(doc(db, "userChats", res.user.uid), {});
                //navigate("/");
            } catch (err) {
                console.log(err);
            }
            });
        });
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
        photoFile = event.target.files[0]
        //uploadFileTest(event.target.files[0]); 
    }

    return (
      <form className="auth-box" onSubmit={onFormSubmit}>
          <h1 className="auth-box-title">GIV Chat</h1>
          <div className="auth-box-type">Register</div>
          <div className='input-field-box'>
            <input type="text" id="auth-name" className='input-field' ref={userNameRef} required/>
            <label htmlFor="auth-name" className="auth-input-label">Name</label>
            <ErrorHandler message={stateErrors.userNameError}/>
          </div>
          <div className='input-field-box'>
            <input type="text" id="auth-emailRef" className='input-field' ref={emailRef} required/>
            <label htmlFor="auth-emailRef" className="auth-input-label">Email</label>
            <ErrorHandler message={stateErrors.emailError}/>
          </div>
          <div className='input-field-box'>
            <input type="password" id="auth-password" className='input-field' ref={passwordRef}  required/>
            <label htmlFor="auth-password" className="auth-input-label">Password</label>
            <ErrorHandler message={stateErrors.passError}/>
          </div>
          <div className='input-field-box'>
            <input type="password" id="auth-repeat-password" className='input-field' ref={confrimPasswordRef} required/>
            <label htmlFor="auth-repeat-password" className="auth-input-label">Repeat Password</label>
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
  