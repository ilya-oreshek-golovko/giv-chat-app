import { FieldValue, Timestamp } from "firebase/firestore";

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
    lastMessage: IMessage,
    // lastMessageDate: Date,
    dateCreated: Timestamp,
    unreadedMessages? : Array<string>
}
interface IChatContext{
    chatID: string,
    user : IUserInfoHeader,
    unreadedMessages: Array<string>
}
interface IMessage{
    id: string,
    date: Timestamp, 
    senderID: string,
    text: string,
    documents: Array<string>
    images: Array<string>,
    isReaded?: boolean
}
interface IChats{
    messages : Array<IMessage> | FieldValue,
    //unreaded : Array<IUnreadedMessages>
}
interface IUserChats{
    [chatID : string] : {
        usersInfo? : Array<IUserInfoHeader>,
        date? : FieldValue,
        lastMessage? : string
    }
}
 

export type {IFriend, IUser, IUserInfoHeader, IChatHeader, IChatContext as IChat, IMessage, IChats, IUserChats}
