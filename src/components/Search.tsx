import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRef, KeyboardEvent, RefObject, useState, MouseEvent, useContext } from 'react'
import { db } from '../firebase/firebase';
import { ErrorHandler } from '../pages/Register';
import Friend from './Friend';
import { IUser } from '../interfaces';
import { AuthContext } from '../context/AuthContext';

type TSearch = {
    error : string,
    users : IUser[] | undefined
}

export default function Search() {
  const userToFind = useRef() as RefObject<HTMLInputElement>;

  const [state, setState] = useState<TSearch>({
    error : "",
    users : undefined
  })

  const currentUser = useContext(AuthContext);

  async function handleSearch() {
    try{
      const userName = userToFind.current?.value;

      if(userName == currentUser.displayName){
        setState({
          error: "It is your name!",
          users : undefined
        });
        return null;
      }
      
      const qSnapshot = await getDocs(query(collection(db, "users"), where("name", "==", userName)));

      if(qSnapshot.size == 0){
        setState({
          error: "User not found!",
          users : undefined
        });
        return null;
      }
      console.log("GIVVV");
      console.log(qSnapshot.size);
      const users : IUser[] = []; 
      qSnapshot.forEach(doc => {
        //console.log(doc.data() as IUser);
        users.push(doc.data() as IUser);
      });
      setState({
        error: "",
        users : users
      });
    }catch(e : any){
      console.log(e);
      setState(state => ({...state, error: `Error: ${e.message}`}));
    }
  }
  

  function handleUserInput(evt : KeyboardEvent<HTMLInputElement>){
    evt.code == "Enter" && handleSearch();
  }

  // function handleSelect(event: MouseEvent<HTMLDivElement>) {
  //   event.preventDefault();
  // }

  return (
    <div className='home-search'>
      <input type="text" ref={userToFind} onKeyDown={handleUserInput} className='search-input' placeholder='Find a friend'/>
      {
        state.error && <ErrorHandler message={state.error} />
      }
      {state.users && 
        state.users.map(user => (
          <Friend key={1} friendName={user.name} lastMessage={"test mes 1"} src={user.photoURL}/>
        ))
      }
    </div>
  )
}

