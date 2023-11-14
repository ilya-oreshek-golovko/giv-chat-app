import { useContext, useEffect, useRef} from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {Register} from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import * as routing from './routing';
import { AuthContext } from "./context/AuthContext";
import Wrapper from "./components/Wrapper";
import { useLocalStorageClearing } from "./hooks/hooks";

export default function App() {

  // const hiddenRef = useRef() as React.RefObject<HTMLDivElement>;
  // const testRef = useRef() as React.RefObject<HTMLDivElement>;
    
  //   useEffect(() => {
        
  //       window.addEventListener('scroll', scrollHandler);
     
  //       return () => window.removeEventListener('scroll', scrollHandler);
        
  //   }, []);
    
  //   const scrollHandler = () => {
        
  //       // if(testRef?.current?.offsetHeight! + testRef?.current?.scrollHeight! >= hiddenRef?.current?.offsetTop!)
  //       //     console.log(`Hidden element is now visible`);
  //       //console.log(testRef?.current?.offsetHeight);
  //      // console.log(testRef?.current?.scrollHeight);
  //       //console.log(hiddenRef?.current?.offsetTop);
  //       console.log(testRef?.current?.scroll);

  //   }
    
  //   return(   
  //       <div>
  //           <div className="testCont" style = {{height: `400px`, border: `5px solid green`, width: `300px`}} ref={testRef} onScroll={scrollHandler}>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div>test</div>
  //             <div ref = {hiddenRef}>Hidden element</div>
  //           </div>
  //       </div>
  //   );
  
  const currentUser = useContext(AuthContext);
  useLocalStorageClearing();

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
              <Home />
            </ProtectedRoute>} />
            <Route path={routing.register} element={<Register />} />
            <Route path={routing.login} element={<Login />} /> 
          </Route>
      </Routes>
    </div>
  );
}
