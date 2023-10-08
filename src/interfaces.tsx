import { Timestamp } from "firebase/firestore";

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
interface IUserInfoHeader{
    name: string,
    photoURL: string,
    uid: string,
}
interface IChatHeader{
    uid : string,
    userInfo: IUserInfoHeader,
    date: Date
}
interface IChat{
    chatID: string,
    user : IUserInfoHeader
}
interface IMessage{
    id: string,
    date: Timestamp, 
    senderID: string,
    text: string,
    img: string
}
 

export type {IFriend, IUser, IUserInfoHeader, IChatHeader, IChat, IMessage}
