import { SyntheticEvent, useRef, useState } from "react";
import { login } from "../routing";
import { addUser, registerWithEmailAndPassword } from "../firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { RegisterError } from "../types";
import { ImFilePicture } from "react-icons/im"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {updateProfile} from 'firebase/auth';
import { storage } from "../firebase/firebase";
import { createUserChat } from "../firebase/chat";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";

export const ErrorHandler = ({message} : {message : string}) => {
    if(!message) return null;
    console.log(message);
    return(
        <div className="auth-error-text">
            {message}
        </div>
    );
}

export function Register() {
    const navigation = useNavigate();

    const userNameRef = useRef() as React.RefObject<HTMLInputElement>;
    const emailRef = useRef() as React.RefObject<HTMLInputElement>;
    const passwordRef = useRef() as React.RefObject<HTMLInputElement>;
    const confrimPasswordRef = useRef() as React.RefObject<HTMLInputElement>;
    const photoFileRef = useRef() as React.RefObject<HTMLInputElement>;

    // const [photo, setState] = useState<TRegister>();
    //let photoFile : File;
    const l = (mes : any) => console.log(mes);

    const [modalView, setModalView] = useState<boolean>(false);
    const [stateErrors, setStateErrors] = useState<RegisterError>({
        userNameError: "",
        emailError: "",
        passError: "",
        confirmPassError: "",
        profileImgErr: ""
    });

    function resetErrors(){
        setStateErrors({
            emailError: "",
            userNameError: "",
            passError: "",
            confirmPassError: "",
            profileImgErr: ""
        });
    }

    function validation(){
        resetErrors();

        if(!userNameRef.current?.value){
            setStateErrors(errors => ({
                ...errors,
                confirmPassError: "Name is empty"
            }));
            return false;
        } else if(!emailRef.current?.value){
            setStateErrors(errors => ({
                ...errors,
                confirmPassError: "Email is empty"
            }));
            return false;
        }else if(!passwordRef.current?.value){
            setStateErrors(errors => ({
                ...errors,
                passError: "passwordRef is empty"
            }));
            return false;
        }else if(!confrimPasswordRef.current?.value){
            setStateErrors(errors => ({
                ...errors,
                confirmPassError: "Confirm passwordRef please"
            }));
            return false;
        } else if(confrimPasswordRef.current?.value !== passwordRef.current?.value){
            setStateErrors(errors => ({
                ...errors,
                confirmPassError: "Passwords don't match. Plese try again"
            }));
            return false;
        }else if(!photoFileRef.current?.files){
            setStateErrors(errors => ({
                ...errors,
                profileImgErr: "Please select your profile image"
            }));
            return false;
        }

        return true;
    }

    async function onFormSubmit(evt : SyntheticEvent<HTMLFormElement, SubmitEvent>){
        evt.preventDefault();

        setModalView(prevState => !prevState);

        if(!validation()){
            l("Some of the values are undefined");
            return null;
        }

        const email = emailRef.current?.value!;
        const password = passwordRef.current?.value!;
        const profile = photoFileRef.current?.files![0]!;
        const userName = userNameRef.current?.value!;


        const res = await registerWithEmailAndPassword(email, password);
    
        if(typeof res !== "object"){
            alert(`Error: ${res}`);
            return;
        }

        //Create a unique image name
        const date = new Date().getTime();
        const storageRef = ref(storage, `${userName + date}`);

        await uploadBytesResumable(storageRef, profile).then(() => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
            try {

                await updateProfile(res.user, {
                    displayName : userName,
                    photoURL: downloadURL,
                });
                l("Profile Updated!");

                await addUser({
                    uid: res.user.uid,
                    name: userName,
                    photoURL: downloadURL,
                    email
                });
                l("User added!");

                await createUserChat(res.user.uid);
                l("Empty chat was created!");
                
                setModalView(prevState => !prevState);
                navigation("/");
            } catch (err) {
                console.log(err);
            }
            });
        });
    }

    function handleProfileImageChange(evt : React.ChangeEvent<HTMLInputElement>){
       resetErrors(); // force the page to be updated after a user changed profile image to show a new one
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
                {
                    photoFileRef.current?.files![0] != undefined 
                    ?
                    <img src={URL.createObjectURL(photoFileRef.current.files[0])} alt="profile-img" className="profile-img" />
                    :
                    <ImFilePicture className="profile-img"/>
                }
                Choose your avatar
                <input type="file" className="input-file" ref={photoFileRef} onChange={handleProfileImageChange}/>
                <ErrorHandler message={stateErrors.profileImgErr}/>
            </label>
            <input type="submit" value="Submit" className="auth-btn-submit"/>
            <p className="auth-footer-notice">
                You already have an account? <Link to={login} className="auth-nav-link">Login</Link>
            </p>
        </form>
    )
  }
  