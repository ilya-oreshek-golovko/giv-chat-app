import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";

export const AuthContext = createContext<any>(null);

export function AuthContextProvider({children} : {children : any}){
    const [currentUser, setCurrentUser] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsub = onAuthStateChanged( auth, (user) => {
            setCurrentUser(user);
            setIsLoading(false);
        });

        return () => {
            unsub();
        }
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