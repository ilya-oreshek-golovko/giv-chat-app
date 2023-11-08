import { Dispatch, MouseEventHandler, SetStateAction, createContext, useState } from "react"
import { TDocument, TImage } from "../types"

export type TSelectedFilesState = {
    images: Array<TImage>,
    documents: Array<TDocument>,
    isOpen: boolean,
    clearSelectedFiles?: Function,
}
export type TSelectedFiles = {
    stateF: TSelectedFilesState,
    setStateF : Dispatch<SetStateAction<TSelectedFilesState>>,
}

const defaultValue = {
    stateF: {
        images: [],
        documents: [],
        isOpen: false
    },
    setStateF: () => {},
}

export const SelectedFilesContext = createContext<TSelectedFiles>(defaultValue);

export function SelectedFilesProvider({children} : {children : any}){
    const [stateF, setStateF] = useState<TSelectedFilesState>(defaultValue.stateF);

    return(
        <SelectedFilesContext.Provider value={{stateF, setStateF}}>
            {children}
        </SelectedFilesContext.Provider>
    )
}