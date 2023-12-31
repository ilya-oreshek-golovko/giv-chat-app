import { useContext, useEffect, useRef} from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {Register} from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import * as routing from './routing';
import { AuthContext } from "./context/AuthContext";
import { useLocalStorageClearing } from "./hooks/hooks";

export default function App() {
  
  const currentUser = useContext(AuthContext);
  useLocalStorageClearing();

  const ProtectedRoute = ({children} : {children : any}) => {
    console.log("APP: Current User ");
    console.log(currentUser);
    if(
      [currentUser.uid, currentUser.email, currentUser.name, currentUser.photoURL].includes("Undefined")
    ){
      return <Navigate to={routing.login}/>
    }

    return children;
  }

  return (
    <div className="app">
      <Routes>
          <Route path={routing.start}>
            <Route index element={<ProtectedRoute>
              <Home />
            </ProtectedRoute>} />
            <Route path={routing.register} element={<Register />} />
            <Route path={routing.login} element={<Login />} /> 
          </Route>
      </Routes>
    </div>
  );
}
