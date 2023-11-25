import {MouseEventHandler, SetStateAction} from 'react';
import { IChat, IChatHeader, IMessage, IUser } from './interfaces';
import { Timestamp } from 'firebase/firestore';

export enum ChatHeaderType{
    friend = "friend",
    currentUser = "user"
}
export enum RegisterErrors{
    emptyName = "Name is empty",
    emptyEmail = "Email is empty",
    emptyPass = "passwordRef is empty",
    emptyConfPass = "Please confirm entered password",
    passMismatch = "Passwords don't match. Plese try again",
    emptyProf = "Please select your profile image",
    profImgError = "By some reason it is impossible to select a profile. Please try again or contact system administrator"

}
export enum InputFilesType{
    img = "images",
    doc = "document"
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
type TScrollIntoViewMessages = {
    ScrollIntoView : boolean,
    lastMessageinSlice : IMessage | undefined
}
type TMessage = {
    message : IMessage, 
    isReaded : boolean, 
    handleMarkMessageAsReaded : (messageIDToDelete : string) => void, 
    handleRightClick : (pageX : number, pageY : number, messageID : string, senderID : string, isSelectedMessageReaded : boolean) => void,//React.MouseEventHandler<HTMLDivElement>, 
    ContextMenuState : TContextMenu,
    scrollState : TScrollIntoViewMessages
}
type TMessagesState = {
    allMessages : IMessage[],
    visibleMessages : IMessage[]
}
type TUseMessagesManagement = {
    creationDateUserChatHeader : Timestamp | undefined,
    userChatHeader   : IChatHeader | undefined,
    friendChatHeader : IChatHeader | undefined,
    currentUser: IUser,
    currentChat : IChat
}
type TUseMessageClickManagement = {
    userChatHeader : IChatHeader | undefined,
    friendChatHeader : IChatHeader | undefined, 
    currentChat : IChat, 
    currentUser : IUser, 
    setContextMenuState : React.Dispatch<SetStateAction<TContextMenu>>, 
    messages : IMessage[]
}

type TUseFormManagement = {
    isValidationFailed : (email : string | undefined, password: string | undefined) => boolean,
    setModalView: React.Dispatch<React.SetStateAction<boolean>>
}
type TRegisterInputComponent = {
    inputLabel : string, 
    inputID : string, 
    errorMessage : string, 
    propName : string,
    inputValue : string,
    inputType : string
};
type TConfirmationBox = {
    handleRejectAction : React.MouseEventHandler<HTMLButtonElement>,
    handleConfirmAction : React.MouseEventHandler<HTMLButtonElement>,
}
type TSelectedFilesState = {
    images: Array<TImage>,
    documents: Array<TDocument>,
    isOpen: boolean,
    clearSelectedFiles?: (filesType : string) => void,
    deleteSelectedFiles?: (fileToDelete : any) => void
}
type TSelectedFiles = {
    selectedFilesState: TSelectedFilesState,
    setSelectedFiles : React.Dispatch<SetStateAction<TSelectedFilesState>>,
}
type TUseActionManagement = {
    setModalState : React.Dispatch<SetStateAction<TModalView>>, 
    clearSelectedFiles : TSelectedFilesState["clearSelectedFiles"], 
    setSelectedFiles : React.Dispatch<SetStateAction<TSelectedFilesState>>,
    filesType : string,
    closeModal : () => void
}
type TUseImagesManagement = {
    setModalState : React.Dispatch<SetStateAction<TModalView>>,
    closeModal : () => void, 
    deleteSelectedFiles : TSelectedFilesState["deleteSelectedFiles"], 
    setSelectedFiles : React.Dispatch<SetStateAction<TSelectedFilesState>>, 
    images : TImage[]
}
type TUseFriendsManagement = {
    setContextMenuState : React.Dispatch<SetStateAction<TContextMenu>>,
    receivedChats: IChatHeader[]
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
    TUseFormManagement,
    TRegisterInputComponent,
    TConfirmationBox,
    TSelectedFilesState,
    TSelectedFiles,
    TUseActionManagement,
    TUseImagesManagement,
    TUseMessageClickManagement,
    TMessagesState,
    TScrollIntoViewMessages,
    TUseFriendsManagement
}