import { useEffect, useState } from "react";
import { RegisterErrors, TRegisterInputComponent, TRegisterState } from "../types";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/SpinnerComponents/LoadingSpinner";
import Modal from "../components/PopupComponents/Modal";
import { addUser, registerWithEmailAndPassword } from "../firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { updateProfile } from "firebase/auth";
import { createChatHeader } from "../firebase/chat";
import { ErrorHandler } from "../components/ErrorComponents/ErrorHandler";
import ViewImage from "../components/PopupComponents/ViewImage";
import { ImFilePicture } from "react-icons/im";

const defaultValue = {
    errors: {
        eEmail: "",
        eUserName: "",
        ePassword: "",
        eConfirmPassword: "",
        eProfileImg: ""
    },
    modal: {
        isOpen: false,
        children: null
    },
    input: {
        userName: "",
        email: "",
        password: "",
        confirmPass: "",
        profile: null
    }
};
const l = (mes : any) => console.log(mes);

function useFormManagement(){

    const [state, setState] = useState<TRegisterState>(defaultValue);
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
            updateStateErrors("eUserName", RegisterErrors.emptyName);
            return false;
        } else if(!state.input.email){
            updateStateErrors("eEmail", RegisterErrors.emptyEmail);
            return false;
        }else if(!state.input.password){
            updateStateErrors("ePassword", RegisterErrors.emptyPass);
            return false;
        }else if(!state.input.confirmPass){
            updateStateErrors("eConfirmPassword", RegisterErrors.emptyConfPass);
            return false;
        } else if(state.input.confirmPass !== state.input.password){
            updateStateErrors("eConfirmPassword", RegisterErrors.passMismatch);
            return false;
        }else if(!state.input.profile){
            updateStateErrors("eProfileImg", RegisterErrors.emptyProf);
            return false;
        }

        return true;
    }

    async function handleUserRegister(){
        const res = await registerWithEmailAndPassword(state.input.email, state.input.password);
        
        if(typeof res !== "object"){
            throw Error(`Error during registration. Details: ${res}`);
        }

        return res.user;
    }

    async function uploadProfileImage(newUser : any){
        //Create a unique image name
        const date = new Date().getTime();
        const storageRef = ref(storage, `${state.input.userName + date}`);

        //profile is defined because its value is validated in validation()
        await uploadBytesResumable(storageRef, state.input.profile!).then(() => {
            getDownloadURL(storageRef).then(async (downloadURL) => {
                await updateProfile(newUser, {
                    displayName : state.input.userName,
                    photoURL: downloadURL,
                });
                l("Profile Updated!");

                await addUser({
                    uid: newUser.uid,
                    name: state.input.userName,
                    photoURL: downloadURL,
                    email: state.input.email
                });
                l("User added!");

                await createChatHeader(newUser.uid, {});
                l("Empty chat was created!");
                
                navigation("/");

            });
        });
    }

    async function onFormSubmit(evt : React.FormEvent<HTMLFormElement>){
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
    
            const newUser = await handleUserRegister();
            await uploadProfileImage(newUser);

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

    return {state, setState, onFormSubmit};
}

function useStoredRegisterData({state, setState} : {state : TRegisterState, setState : React.Dispatch<React.SetStateAction<TRegisterState>>}){
    const localKey = "register-data";

    const saveRegisterData = () => {
        console.log(JSON.stringify(state.input));
        localStorage.setItem(localKey, JSON.stringify({
            ...state,
            input: {
                ...state.input,
                password: null,
                confirmPass: null,
                profile: null
            }
        }));
        // state.input.profile.arrayBuffer().then((arrayBuffer) => {
        //     console.log("arrayBuffer");
        //     // const imageBlob = new Blob([new Uint8Array(arrayBuffer)], {type:'image/jpeg'});
        //     // const storedProfile = new File([imageBlob], "test.jpeg", {
        //     //     type: "image/jpeg"
        //     // });
        //     // console.log(imageBlob);
        //     // console.log(storedProfile);
        //     //console.log(JSON.stringify([new Uint8Array(arrayBuffer)]));
        //     const serializedProfile = {
        //         array: [new Uint8Array(arrayBuffer)],
        //         type: state.input.profile!.type,
        //         name: state.input.profile!.name
        //     };
        //     localStorage.setItem(localKey, JSON.stringify({
        //         ...state,
        //         input: {
        //             ...state.input,
        //             profile: serializedProfile
        //         }
        //     }));
        // });
        
    }
    
    useEffect(() => {
        const lState = JSON.parse(localStorage.getItem(localKey)!);
        console.log("lState");
        console.log(lState);
        if(!lState){
            setState(defaultValue);
        }else{
            //console.log("RESTORE");
            // console.log(lState.input.profile.array[0]);
            // const resut = [];
            // for(const el in lState.input.profile.array[0]){
            //     resut.push(lState.input.profile.array[0][el]);
            // }

            // const imageBlob = new Blob(resut, {type:'image/jpeg'});
            // const storedProfile = new File(resut, lState.input.profile.name, {
            //     type: lState.input.profile.type
            // });

            // setState({
            //     errors: lState.errors,
            //     modal: lState.modal,
            //     input : {
            //         ...lState.input,
            //         profile: null
            //     }
            // });
            setState(lState);
        }
    }, [])

    useEffect(() => {
        const handler = setTimeout(() => saveRegisterData(), 500);
        return () => clearTimeout(handler);
    }, [state.input.confirmPass, state.input.email, state.input.password, state.input.profile, state.input.userName])
}

function useInputManagement({setState} : {setState : React.Dispatch<React.SetStateAction<TRegisterState>>}){
    
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

    const InputComponent = ({inputLabel, inputID, errorMessage, propName, inputValue, inputType} : TRegisterInputComponent) => {
        return(
            <div className='input-field-box'>
                <input type={inputType} id={inputID} className='input-field' value={inputValue} onChange={generateChangeHandler(propName)} required/>
                <label htmlFor={inputID} className="auth-input-label">{inputLabel}</label>
                <ErrorHandler message={errorMessage}/>
            </div>
        )
    }

    return {
        InputComponent
    }
}

function useProfilManagement({state, setState} : {state : TRegisterState, setState : React.Dispatch<React.SetStateAction<TRegisterState>>}){

    function handleProfileImageClick(selectedFile : File | null){
        const profile = state.input.profile ? state.input.profile : selectedFile;
        if(!profile){
            setState(prevState => ({
                ...prevState,
                errors : {
                    ...prevState.errors,
                    eProfileImg : RegisterErrors.profImgError
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

    const ProfileComponent = () => {
        return (
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
        )
    }

    return{
        ProfileComponent
    }
}

export {
    useStoredRegisterData,
    useFormManagement,
    useInputManagement,
    useProfilManagement
}