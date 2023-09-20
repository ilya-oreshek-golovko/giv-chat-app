import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import * as routing from './routing';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { firebaseApp } from "./firebase/firebase";

function App() {
  type AppState ={
    currentUser : any
  }

  const [state, setState] = useState<AppState>();

  function authStateChanged(user : any){
    console.log(user);
    setState({currentUser: user});
  }
  useEffect(() => {
    onAuthStateChanged(getAuth(firebaseApp), authStateChanged);
  }, []);

  const ProtectedRoute = ({children} : {children : any}) => {
    if(!state?.currentUser){
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
          <Route path={routing.home} element={<Home />}/>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
