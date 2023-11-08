import { Dispatch, SetStateAction, createContext, useState } from "react"

type TModalState = {
    isModalOpen : boolean,
    children : any
}
export type TModal = {
    isModalOpen: boolean,
    setOpenModal : Dispatch<SetStateAction<boolean>>,
}

const defaultValue = {
    isModalOpen : false,
    setOpenModal: () => {},
}

export const ModalContext = createContext<TModal>(defaultValue);

export function ModalProvider({children} : {children : any}){
    const [isModalOpen, setOpenModal] = useState<boolean>(defaultValue.isModalOpen);

    return(
        <ModalContext.Provider value={{isModalOpen, setOpenModal}}>
            {children}
        </ModalContext.Provider>
    )
}