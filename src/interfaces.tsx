import React, { ReactChildren, ReactChild } from 'react';

interface IFriend{
    name: string,
    chat: Array<any>,
    img: string,
    id: number
}
interface IUser{
    uid: string;
    name: string,
    photoURL: string,
    email: string
}
 
interface IChild {
  children: ReactChild | undefined | Element | null
}


export type {IFriend, IUser, IChild}
