import {MouseEventHandler} from 'react';
import { IChatHeader, IMessage, IUser } from './interfaces';
import { Timestamp } from 'firebase/firestore';

export enum ChatHeaderType{
    friend = "friend",
    currentUser = "user"
}
type TLoginError = {
    emailError: string,
    passError: string
}
type FriendProps = {
    chatHeader: any,
    handleObjClick: MouseEventHandler<HTMLDivElement>,
    handleRightClick?: (pageX : number, pageY : number, friendChatHeaderID : string, chatID : string) => void // Function
}
type RegisterError = {
    eUserName: string,
    eEmail: string,
    ePassword: string,
    eConfirmPassword: string,
    eProfileImg : string
}
type TDocument = {
    docFile? : File,
    docLink : string
}
type TImage = {
    imgFile? : File,
    imgLink : string
}
type InputState = {
    text : string,
    images : Array<TImage>,
    documents: Array<TDocument>,
    isSendClicked : boolean
}
type TModalView = {
    isOpen : boolean,
    children : React.ReactNode // (JSX.Element = React.ReactElement) they are more strict than React.ReactNode
}
type TRegisterInput = {
    userName : string,
    email : string,
    password : string,
    confirmPass : string,
    profile : File | null,
}
type TRegisterState = {
    errors : RegisterError,
    modal: TModalView,
    input: TRegisterInput
}
type TContextMenu = {
    top : number, 
    left : number,
    isOpen?: boolean,
    handleEditClick?: () => void,
    handleDeleteClick: () => void
}
type TMessage = {
    message : IMessage, 
    isReaded : boolean, 
    handleMarkMessageAsReaded : (messageIDToDelete : string) => void, 
    handleRightClick : (pageX : number, pageY : number, messageID : string, senderID : string, isSelectedMessageReaded : boolean) => void,//React.MouseEventHandler<HTMLDivElement>, 
    ContextMenuState : TContextMenu
}
type TUseMessagesManagement = {
    creationDateUserChatHeader : Timestamp | undefined,
    userChatHeader   : IChatHeader | undefined,
    friendChatHeader : IChatHeader | undefined,
    currentUser: IUser
}

type TUseFormManagement = {
    isValidationFailed : (email : string | undefined, password: string | undefined) => boolean,
    setModalView: React.Dispatch<React.SetStateAction<boolean>>
}

export type {
    FriendProps, 
    RegisterError, 
    TDocument, 
    TImage, 
    InputState, 
    TModalView,
    TRegisterInput, 
    TRegisterState, 
    TContextMenu, 
    TMessage, 
    TUseMessagesManagement,
    TLoginError,
    TUseFormManagement
}