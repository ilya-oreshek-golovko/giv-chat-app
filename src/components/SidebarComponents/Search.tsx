import { collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { useRef, KeyboardEvent, RefObject, useState, useContext, MouseEvent } from 'react'
import { db } from '../../firebase/firebase';
import { ErrorHandler } from '../../pages/Register';
import Friend from './Friend';
import { IChat, IChatHeader, IChats, IUser, IUserChats, IUserInfoHeader } from '../../interfaces';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';
import { createChat, getChat, getChatHeader, updateChatHeader } from '../../firebase/chat';
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
    setState({
      error : "",
      users : []
    });
    userToFind.current!.value = "";
  }

  function dropError(errorMessage : string, foundUsers : Array<IUser> = []){
    setState({
      error: errorMessage,
      users : foundUsers
    });

    setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        error: ""
      }));
    }, 5000);
  }

  async function handleSearch() {
    try{
      const userName = userToFind.current?.value;

      if(userName == currentUser.name){
        dropError("It is your name!");
        return null;
      }
      
      const qSnapshot = await getDocs(query(collection(db, "users"), where("name", "==", userName)));

      if(qSnapshot.size == 0){
        dropError("User not found!")
        return null;
      }

      const users : IUser[] = []; 
      qSnapshot.forEach(doc => {
        users.push(doc.data() as IUser);
      });
      dropError("", users)
    }catch(e : any){
      console.log(e);
      dropError(`Error: ${e.message}`, state.users);
    }
  }
  
  function handleUserInput(evt : KeyboardEvent<HTMLInputElement>){
    evt.code == "Enter" && handleSearch();
  }

  async function handleSelect(selectedUser : IUser) {
    try{
      const currentUserInfo : IUserInfoHeader = {
        name: currentUser.name,
        photoURL: currentUser.photoURL,
        uid: currentUser.uid
      }
      const friendInfo : IUserInfoHeader = {
        name: selectedUser.name,
        photoURL: selectedUser.photoURL,
        uid: selectedUser.uid
      };

      const isSelectedFriendAlreadyinChat = (chatID : string, currentUserChatHeader : any) : boolean =>{
        if(!currentUserChatHeader[chatID]) return false;
    
        if(currentChat.chatID !== chatID){
          const unreadedMessages = receivedChats.find(chatHeader => chatHeader.uid == chatID)?.unreadedMessages;
          //if(!unreadedMessages) alert("There is an error with unreaded messages. Please contact system administrator");

          setCurrentChat({
              chatID: chatID,
              user: {
                name: selectedUser.name,
                photoURL: selectedUser.photoURL,
                uid: selectedUser.uid
              },
              unreadedMessages: unreadedMessages || []
          });
        }

        clearState();
    
        return true;
      }
      const createChatIfItNotExist = async (chatID : string) => {
        const chatObj = await getChat(chatID);
        if(chatObj.exists()) return;

        const chat : IChats = {
          messages : []
        };
        await createChat(chatID, chat);
        l("Chat was created!");
      }
      const updateChatHeaderCurrentUser = async () : Promise<IUserInfoHeader> => {
  
        const currentUserChats = {
          [`${chatID}.userInfo`] : friendInfo,
          [`${chatID}.dateCreated`] : serverTimestamp()
        } 
        await updateChatHeader(currentUser.uid, currentUserChats);
        l("Chat Header(currentUser) was created!");

        return friendInfo;
      }
      const updateChatHeaderSelectedUser = async () : Promise<IUserInfoHeader> => {
        const friendChatHeader = await getChatHeader(friendInfo.uid);
        if(friendChatHeader) return friendInfo;

        const friendChats = {
          [`${chatID}.userInfo`] : currentUserInfo,
          [`${chatID}.dateCreated`] : serverTimestamp()
        }
  
        await updateChatHeader(selectedUser.uid, friendChats);
        l("Chat Header(user) was created!");

        return friendInfo;
      }
      const defineCurrectChat = (friendInfo : IUserInfoHeader) => {
        setCurrentChat({
            chatID: chatID,
            user: friendInfo,
            unreadedMessages: []
        });
      }
      

      const chatID = getCombinedChatID(currentUser.uid, selectedUser.uid);
      const currentUserChatHeader = await getChatHeader(currentUser.uid);

      if(isSelectedFriendAlreadyinChat(chatID, currentUserChatHeader)) return;

      createChatIfItNotExist(chatID);
      updateChatHeaderCurrentUser();
      updateChatHeaderSelectedUser().then(friendInfo => {
        defineCurrectChat(friendInfo);
      });

      // updateChatHeaderBothUsers().then(friendInfo => {
      //   defineCurrectChat(friendInfo);
      // });
      
      clearState();
    }catch(e : any){
      l(e);
      alert(e);
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
            userInfo: {name: user.name, photoURL: user.photoURL, uid: user.uid}
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

