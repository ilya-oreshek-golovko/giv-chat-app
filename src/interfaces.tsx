interface IFriend{
    name: string,
    chat: Array<any>,
    img: string,
    id: number
}
interface IUser{
    name: string,
    friends : Array<number>,
    profileImg: string,
    email: string
}


export type {IFriend, IUser}
