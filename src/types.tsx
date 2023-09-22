type FriendProps = {
    key: number,
    friendName : string,
    lastMessage: string,
    src: string
}
type RegisterError = {
    userNameError: string,
    emailError: string,
    passError: string,
    confirmPassError: string,
    profileImgErr : string
}

export type {FriendProps, RegisterError}