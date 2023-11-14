import {MouseEventHandler} from 'react';
import { IChatHeader } from './interfaces';

type FriendProps = {
    chatHeader: IChatHeader,
    handleObjClick: MouseEventHandler<HTMLDivElement>
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
    children : JSX.Element | null
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

export type {FriendProps, RegisterError, TDocument, TImage, InputState, TModalView, TRegisterInput, TRegisterState}