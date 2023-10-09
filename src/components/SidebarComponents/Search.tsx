import { collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { useRef, KeyboardEvent, RefObject, useState, useContext, MouseEvent } from 'react'
import { db } from '../../firebase/firebase';
import { ErrorHandler } from '../../pages/Register';
import Friend from './Friend';
import { IUser, IUserInfoHeader } from '../../interfaces';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { createChat, getChat, updateChatHeader } from '../../firebase/chat';
import { getCombinedChatID } from '../../hooks/hooks';

type TSearch = {
    error : string,
    users : IUser[] | undefined
}
const l = (mes : any) => console.log(mes);

export default function Search() {
  
  const userToFind = useRef() as RefObject<HTMLInputElement>;

  const [state, setState] = useState<TSearch>({
    error : "",
    users : undefined
  });

  const currentUser = useContext(AuthContext);
  const cChat = useContext(ChatContext);

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

      console.log(qSnapshot.size);
      const users : IUser[] = []; 
      qSnapshot.forEach(doc => {
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

  async function handleSelect(user : IUser) {

    const combinedID = getCombinedChatID(currentUser.uid, user.uid);
    
    try{
      const chatObj = await getChat(combinedID);

      if(!chatObj.exists()){

        await createChat(combinedID);
        l("Chat was created!");

        await updateChatHeader(currentUser.uid, {
          [combinedID + ".userInfo"] : {
            name: user.name,
            photoURL: user.photoURL,
            uid: user.uid
          } as IUserInfoHeader,
          [combinedID + ".date"] : serverTimestamp()
        });
        l("Chat Header(currentUser) was created!");

        await updateChatHeader(user.uid, {
          [combinedID + ".userInfo"] : {
            name: currentUser.displayName,
            photoURL: currentUser.photoURL,
            uid: currentUser.uid
          } as IUserInfoHeader,
          [combinedID + ".date"] : serverTimestamp()
        });
        l("Chat Header(user) was created!");

        cChat?.setCurrentChat({
            chatID: combinedID,
            user: {
              name: user.name,
              photoURL: user.photoURL,
              uid: user.uid
            } as IUserInfoHeader
        });
      }

    }catch(e : any){
      l(e);
    }

  } 


  return (
    <div className='home-search'>
      <input type="text" ref={userToFind} onKeyDown={handleUserInput} className='search-input' placeholder='Find a friend'/>
      {
        state.error && <ErrorHandler message={state.error} />
      }
      {state.users && 
        state.users.map(user => (
          <Friend key={user.uid} friendName={user.name} lastMessage="" src={user.photoURL} 
          handleObjClick={
            (evt : MouseEvent<HTMLDivElement>) => {
              evt.preventDefault();
              handleSelect(user);
            }
        } />
        ))
      }
    </div>
  )
}

