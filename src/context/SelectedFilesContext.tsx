import { createContext, useState } from "react"
import { TSelectedFiles, TSelectedFilesState } from "../types"

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