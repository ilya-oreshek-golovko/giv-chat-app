import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { IUser } from "../interfaces";

const defaultContextValue = {
    uid: "",
    name: "",
    photoURL: "",
    email: "",
    unreadedMessages: []
}
export const AuthContext = createContext<IUser>(defaultContextValue);

export function AuthContextProvider({children} : {children : any}){
    const [currentUser, setCurrentUser] = useState<IUser>(defaultContextValue);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    function authStateChanged(user : User | null){
        const contextUser : IUser = {
            uid: user?.uid || "Undefined",
            name: user?.displayName || "Undefined",
            photoURL: user?.photoURL || "Undefined",
            email: user?.email || "Undefined"
        }
        setCurrentUser(contextUser);
        setIsLoading(false);
    };

    useEffect(() => {
        onAuthStateChanged( auth, authStateChanged);
    }, []);

    return(
        <AuthContext.Provider value={currentUser}>
            {isLoading 
            ? 
            <Modal isOpen={isLoading}>
              <LoadingSpinner />
            </Modal> 
            : 
            children}
        </AuthContext.Provider>
    );
}