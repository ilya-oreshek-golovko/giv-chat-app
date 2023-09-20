type FriendProps = {
    key: number,
    friendName : string,
    lastMessage: string,
    src: string
}
type RegisterError = {
    userName: string,
    emailError: string,
    passError: string,
    confirmPassError: string
}

export type {FriendProps, RegisterError}