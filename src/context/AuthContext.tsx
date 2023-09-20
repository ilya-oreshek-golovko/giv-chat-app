import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";

export const AuthContext = createContext<any>(null);

export function AuthContextProvider({children} : {children : any}){
    const [currentUser, setCurrentUser] = useState<any>();

    useEffect(() => {
        const unsub = onAuthStateChanged( auth, (user) => {
            setCurrentUser(user);
            console.log(currentUser);
        });

        return () => {
            unsub();
        }
    }, []);

    return(
        <AuthContext.Provider value={currentUser}>
            {children}
        </AuthContext.Provider>
    );
}