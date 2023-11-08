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
    users : IUser[]
}
const l = (mes : any) => console.log(mes);

export default function Search() {
  console.log("SEARCH");
  const userToFind = useRef() as RefObject<HTMLInputElement>;

  const [state, setState] = useState<TSearch>({
    error : "",
    users : []
  });

  const currentUser = useContext(AuthContext);
  const cChat = useContext(ChatContext);

  function clearState(){
    setState({
      error : "",
      users : []
    });
    userToFind.current!.value = "";
  }

  async function handleSearch() {
    try{
      const userName = userToFind.current?.value;

      if(userName == currentUser.displayName){
        setState({
          error: "It is your name!",
          users : []
        });
        return null;
      }
      
      const qSnapshot = await getDocs(query(collection(db, "users"), where("name", "==", userName)));

      if(qSnapshot.size == 0){
        setState({
          error: "User not found!",
          users : []
        });
        return null;
      }

      const users : IUser[] = []; 
      qSnapshot.forEach(doc => {
        users.push(doc.data() as IUser);
      });
      setState({
        error: "",
        users
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
    try{
      const isSelectedFriendAlreadyinChat = () : boolean =>{
        if(!chatObj.exists()) return false;
    
        if(cChat?.currentChat?.chatID !== chatID){
          cChat?.setCurrentChat({
              chatID: chatID,
              user: friendInfo
          });
        }
        clearState();
    
        return true;
      }

      const chatID = getCombinedChatID(currentUser.uid, user.uid);
      const chatObj = await getChat(chatID);

      const friendInfo : IUserInfoHeader = {
        name: user.name,
        photoURL: user.photoURL,
        uid: user.uid
      };
      if(isSelectedFriendAlreadyinChat()) return;

      await createChat(chatID);
      l("Chat was created!");

      await updateChatHeader(currentUser.uid, {
        [chatID + ".userInfo"] : friendInfo as IUserInfoHeader,
        [chatID + ".date"] : serverTimestamp()
      });
      l("Chat Header(currentUser) was created!");

      await updateChatHeader(user.uid, {
        [chatID + ".userInfo"] : {
          name: currentUser.displayName,
          photoURL: currentUser.photoURL,
          uid: currentUser.uid
        } as IUserInfoHeader,
        [chatID + ".date"] : serverTimestamp()
      });
      l("Chat Header(user) was created!");

      cChat?.setCurrentChat({
          chatID: chatID,
          user: {
            name: user.name,
            photoURL: user.photoURL,
            uid: user.uid
          } as IUserInfoHeader
      });
      
      clearState();
    }catch(e : any){
      l(e);
    }
  } 


  return (
    <div className='home-search'>
      <div className="search-input-box">
        <input type="text" ref={userToFind} onKeyDown={handleUserInput} className='search-input' placeholder='Find a friend'/>
        <p className="btn-clear-search-result" onClick={() => clearState()}>x</p>
      </div>
      {
        state.error && <ErrorHandler message={state.error} />
      }
      {state.users.length > 0 && 
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

