import { Dispatch, SetStateAction, createContext, useState } from "react"
import { TDocument, TImage } from "../types"

export type TSelectedFilesState = {
    images: Array<TImage>,
    documents: Array<TDocument>,
    isOpen: boolean,
    clearSelectedFiles?: Function,
    deleteSelectedFiles?: Function
}
export type TSelectedFiles = {
    selectedFilesState: TSelectedFilesState,
    setSelectedFiles : Dispatch<SetStateAction<TSelectedFilesState>>,
}

const defaultValue = {
    selectedFilesState: {
        images: [],
        documents: [],
        isOpen: false
    },
    setSelectedFiles: () => {},
}

export const SelectedFilesContext = createContext<TSelectedFiles>(defaultValue);

export function SelectedFilesProvider({children} : {children : any}){
    const [selectedFilesState, setSelectedFiles] = useState<TSelectedFilesState>(defaultValue.selectedFilesState);
    const value = {selectedFilesState, setSelectedFiles};

    return(
        <SelectedFilesContext.Provider value={value}>
            {children}
        </SelectedFilesContext.Provider>
    )
}