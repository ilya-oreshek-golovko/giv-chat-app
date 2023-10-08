import {MouseEventHandler} from 'react';

type FriendProps = {
    key: string,
    friendName : string,
    lastMessage: string,
    src: string,
    handleObjClick: MouseEventHandler<HTMLDivElement>
}
type RegisterError = {
    userNameError: string,
    emailError: string,
    passError: string,
    confirmPassError: string,
    profileImgErr : string
}

export type {FriendProps, RegisterError}