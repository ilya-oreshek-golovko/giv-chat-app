import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { login } from "../routing";
import { addUser, registerWithEmailAndPassword } from "../firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { RegisterError, TModalView, TRegisterState } from "../types";
import { ImFilePicture } from "react-icons/im"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {updateProfile} from 'firebase/auth';
import { storage } from "../firebase/firebase";
import { createChatHeader } from "../firebase/chat";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";
import ViewImage from "../components/ViewImage";
import { useStoredRegisterData } from "../hooks/hooks";

export const ErrorHandler = ({message} : {message : string}) => {
    if(!message) return null;
    console.log(message);
    return(
        <div className="auth-error-text">
            {message}
        </div>
    );
}

const l = (mes : any) => console.log(mes);
export function Register() {

    type TInputComponent = {
        inputLabel : string, 
        inputID : string, 
        errorMessage : string, 
        propName : string,
        inputValue : string,
        inputType : string
    };
    const possibleErrors = {
        "emptyName" : "Name is empty",
        "emptyEmail" : "Email is empty",
        "emptyPass" : "passwordRef is empty",
        "emptyConfPass" : "Please confirm entered password",
        "passMismatch" : "Passwords don't match. Plese try again",
        "emptyProf" : "Please select your profile image",
        "profImgError" : "By some reason it is impossible to select a profile. Please try again or contact system administrator"
    }

    const {state, setState} = useStoredRegisterData();
    console.log()
    const navigation = useNavigate();

    function resetErrors(){
        setState(prevState => 
            ({
                ...prevState,
                errors: {
                    eEmail: "",
                    eUserName: "",
                    ePassword: "",
                    eConfirmPassword: "",
                    eProfileImg: ""
                }
            })
        );
    }

    function updateStateErrors(propName : string, errorMessage : string){
        setState(prevState => ({
            ...prevState,
            errors : {
                ...prevState.errors,
                [propName]: errorMessage
            }
        }));
    }

    function validation(){
        resetErrors();

        if(!state.input.userName){
            updateStateErrors("eUserName", possibleErrors["emptyName"]);
            return false;
        } else if(!state.input.email){
            updateStateErrors("eEmail", possibleErrors["emptyEmail"]);
            return false;
        }else if(!state.input.password){
            updateStateErrors("ePassword", possibleErrors["emptyPass"]);
            return false;
        }else if(!state.input.confirmPass){
            updateStateErrors("eConfirmPassword", possibleErrors["emptyConfPass"]);
            return false;
        } else if(state.input.confirmPass !== state.input.password){
            updateStateErrors("eConfirmPassword", possibleErrors["passMismatch"]);
            return false;
        }else if(!state.input.profile){
            updateStateErrors("eProfileImg", possibleErrors["emptyProf"]);
            return false;
        }

        return true;
    }

    async function onFormSubmit(evt : SyntheticEvent<HTMLFormElement, SubmitEvent>){
        evt.preventDefault();

        try{
            if(!validation()){
                throw Error("Some of the values are undefined");
            }

            setState(prevState => ({
                ...prevState,
                modal : {
                    isOpen : true,
                    children : (
                        <Modal isOpen={true}>
                            <LoadingSpinner />
                        </Modal>
                        )
                }
            }));
      
            const res = await registerWithEmailAndPassword(state.input.email, state.input.password);
        
            if(typeof res !== "object"){
                throw Error(`Error during registration. Details: ${res}`);
            }
    
            //Create a unique image name
            const date = new Date().getTime();
            const storageRef = ref(storage, `${state.input.userName + date}`);
    
            //profile is defined because its value is validated in validation()
            await uploadBytesResumable(storageRef, state.input.profile!).then(() => {
                getDownloadURL(storageRef).then(async (downloadURL) => {
                    await updateProfile(res.user, {
                        displayName : state.input.userName,
                        photoURL: downloadURL,
                    });
                    l("Profile Updated!");
    
                    await addUser({
                        uid: res.user.uid,
                        name: state.input.userName,
                        photoURL: downloadURL,
                        email: state.input.email
                    });
                    l("User added!");
    
                    await createChatHeader(res.user.uid, {});
                    l("Empty chat was created!");
                    
                    navigation("/");
    
                });
            });
        }catch(e : any){
            l(e.message);
        }

        setState(prevState => ({
            ...prevState,
            modal : {
                isOpen : false,
                children : null
            }
        }));
    }

    function handleProfileImageClick(selectedFile : File | null){
        const profile = state.input.profile ? state.input.profile : selectedFile;
        if(!profile){
            setState(prevState => ({
                ...prevState,
                errors : {
                    ...prevState.errors,
                    eProfileImg : possibleErrors["profImgError"]
                }
            }));
            return;
        }

        const closeModalWindow = () => {
            setState(prevState => ({
                ...prevState,
                input: {
                    ...prevState.input,
                    profile: null
                },
                modal: {
                    isOpen: false,
                    children: null
                }
            }));
        }
        const saveFile = () => {
            setState(prevState => ({
                ...prevState,
                input : {
                    ...prevState.input,
                    profile
                },
                modal: {
                    isOpen: false,
                    children: null
                }
            }));
        }
        setState(prevState => ({
            ...prevState,
            modal: {
                isOpen: true,
                children: (
                    <Modal isOpen={true}>
                        <ViewImage 
                            imageLink={URL.createObjectURL(profile)} 
                            handleConfirmClick={() => saveFile()}
                            handleRejectClick={() => closeModalWindow()}
                            title={"your profile image"}
                            roundedImage={true}
                        />
                    </Modal>
                )
            }
        }));
    }
    
    function generateChangeHandler(propName : string) : React.ChangeEventHandler<HTMLInputElement>{
        return (evt: React.ChangeEvent<HTMLInputElement>) => {
            setState(prevState => ({
                ...prevState,
                input : {
                    ...prevState.input,
                    [propName] : evt.target.value
                }
            }));
        }
    }
    const InputComponent = ({inputLabel, inputID, errorMessage, propName, inputValue, inputType} : TInputComponent) => {
        return(
            <div className='input-field-box'>
                <input type={inputType} id={inputID} className='input-field' value={inputValue} onChange={generateChangeHandler(propName)} required/>
                <label htmlFor={inputID} className="auth-input-label">{inputLabel}</label>
                <ErrorHandler message={errorMessage}/>
            </div>
        )
    }

    return (
        <form className="auth-box" onSubmit={onFormSubmit}>
            {
                state.modal.isOpen &&
                state.modal.children
            }
            <h1 className="auth-box-title">GIV Chat</h1>
            <div className="auth-box-type">Register</div>
            {InputComponent({ 
                inputID:"auth-name",
                inputLabel:"Name", 
                propName:"userName",
                inputValue: state.input.userName,
                inputType : "text",
                errorMessage: state.errors.eUserName
            })}
            {InputComponent({ 
                inputID:"auth-email",
                inputLabel:"Email", 
                propName:"email",
                inputValue: state.input.email,
                inputType : "text",
                errorMessage: state.errors.eEmail
            })}
            {InputComponent({ 
                inputID:"auth-password",
                inputLabel:"Password", 
                propName:"password",
                inputValue: state.input.password,
                inputType : "password",
                errorMessage: state.errors.ePassword
            })}
            {InputComponent({ 
                inputID:"auth-repeat-password",
                inputLabel:"Repeat Password", 
                propName:"confirmPass",
                inputValue: state.input.confirmPass,
                inputType : "password",
                errorMessage: state.errors.eConfirmPassword
            })}
            <label className="input-file-desctop">
                {
                    state.input.profile
                    ?
                    <div className="input-profile-box">
                        <img 
                            src={URL.createObjectURL(state.input.profile)} 
                            alt="profile-img" 
                            className="profile-img selected" 
                            onClick={() => handleProfileImageClick(null)}/>
                            
                    </div>
                    :
                    <>
                        <ImFilePicture className="profile-img"/>
                        {"Choose your avatar"}
                        <input type="file" className="input-file" onChange={(evt : React.ChangeEvent<HTMLInputElement>) => handleProfileImageClick(evt.target.files ? evt.target.files[0] : null)}/>
                        <ErrorHandler message={state.errors.eProfileImg}/>
                    </>
                }
            </label>
            <input type="submit" value="Submit" className="auth-btn-submit btn"/>
            <p className="auth-footer-notice">
                You already have an account? <Link to={login} className="auth-nav-link">Login</Link>
            </p>
        </form>
    )
  }
  