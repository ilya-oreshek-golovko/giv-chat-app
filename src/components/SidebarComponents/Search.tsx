import { collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { useRef, KeyboardEvent, RefObject, useState, useContext, MouseEvent } from 'react'
import { db } from '../../firebase/firebase';
import { ErrorHandler } from '../../pages/Register';
import Friend from './Friend';
import { IChatHeader, IChats, IUser, IUserChats, IUserInfoHeader } from '../../interfaces';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { createChat, getChat, updateChatHeader } from '../../firebase/chat';
import { getCombinedChatID } from '../../hooks/hooks';

type TSearch = {
    error : string,
    users : IUser[]
}
const l = (mes : any) => console.log(mes);

export default function Search({receivedChats} : {receivedChats : IChatHeader[]}) {
  console.log("SEARCH");
  const userToFind = useRef() as RefObject<HTMLInputElement>;

  const [state, setState] = useState<TSearch>({
    error : "",
    users : []
  });

  const currentUser : IUser  = useContext(AuthContext);
  const {currentChat, setCurrentChat} = useContext(ChatContext);

  function clearState(){
    console.log("YYYYYYYYYYYYYYYYYY");
    setState({
      error : "",
      users : []
    });
    userToFind.current!.value = "";
  }

  async function handleSearch() {
    try{
      const userName = userToFind.current?.value;

      if(userName == currentUser.name){
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

      const isSelectedFriendAlreadyinChat = (chatObj : any) : boolean =>{
        if(!chatObj.exists()) return false;
    
        if(currentChat.chatID !== chatID){
          // const unreadedMessages = receivedChats.find(chatHeader => chatHeader.uid == chatID)?.unreadedMessages;
          // if(!unreadedMessages) alert("There is an error with unreaded messages. Please contact system administrator");

          setCurrentChat({
              chatID: chatID,
              user: {
                name: user.name,
                photoURL: user.photoURL,
                uid: user.uid
              },
              unreadedMessages: []
              //unreadedMessages: unreadedMessages || []
          });
        }
        clearState();
    
        return true;
      }

      const chatID = getCombinedChatID(currentUser.uid, user.uid);
      const chatObj = await getChat(chatID);
      console.log("Test chatObj");
      console.log(chatObj);
      //if(isSelectedFriendAlreadyinChat(chatObj)) return;

      const chat : IChats = {
        messages : []
        //unreaded : []
      };
      await createChat(chatID, chat);
      l("Chat was created!");

      const friendInfo : IUserInfoHeader = {
        name: user.name,
        photoURL: user.photoURL,
        uid: user.uid
      };
      const currentUserInfo : IUserInfoHeader = {
        name: currentUser.name,
        photoURL: currentUser.photoURL,
        uid: currentUser.uid
      }

      const currentUserChats = {
        [`${chatID}.userInfo`] : friendInfo,
        [`${chatID}.date`] : serverTimestamp()
      } 
      const friendChats = {
        [`${chatID}.userInfo`] : currentUserInfo,
        [`${chatID}.date`] : serverTimestamp()
      }

      await updateChatHeader(currentUser.uid, currentUserChats);
      l("Chat Header(currentUser) was created!");
      await updateChatHeader(user.uid, friendChats);
      l("Chat Header(user) was created!");

       setCurrentChat({
          chatID: chatID,
          user: friendInfo,
          unreadedMessages: []
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
          <Friend 
          chatHeader={{
            uid : user.uid,
            userInfo: {name: user.name,photoURL: user.photoURL, uid: user.uid},
            lastMessage: "",
            date: new Date() // TODO
          }} 
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

