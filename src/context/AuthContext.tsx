import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";

export const AuthContext = createContext<any>(null);

export function AuthContextProvider({children} : {children : any}){
    const [currentUser, setCurrentUser] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        console.log("Test GIV");
        const unsub = onAuthStateChanged( auth, (user) => {
            setCurrentUser(user);
            setIsLoading(false);
            console.log(`user: ${user}`);
        });

        return () => {
            unsub();
        }
    }, []);

    return(
        <AuthContext.Provider value={currentUser}>
            {isLoading ? <div className="app-loading-page">Loading...</div> : children}
        </AuthContext.Provider>
    );
}