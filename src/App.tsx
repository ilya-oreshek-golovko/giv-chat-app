import { useContext} from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {Register} from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import * as routing from './routing';
import { AuthContext } from "./context/AuthContext";
import Wrapper from "./components/Wrapper";

export default function App() {
  
  const currentUser = useContext(AuthContext);

  const ProtectedRoute = ({children} : {children : any}) => {
    console.log("APP: Current User " + currentUser);
    if(!currentUser){
      return <Navigate to={routing.login}/>
    }

    return children;
  }

  return (
    <div className="app">
      <Routes>
          <Route path={routing.start}>
            <Route index element={<ProtectedRoute>
              <Wrapper>
                <Home />
              </Wrapper> 
            </ProtectedRoute>} />
            <Route path={routing.register} element={<Wrapper><Register /></Wrapper>} />
            <Route path={routing.login} element={<Wrapper><Login /></Wrapper>} /> 
          </Route>
      </Routes>
    </div>
  );
}
