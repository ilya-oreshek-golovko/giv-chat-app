import { useEffect, useRef, useState } from "react";
import ContextMenu from "../components/ContextMenu/ContextMenu";
import { TContextMenu, TMessage, TMessagesState, TScrollIntoViewMessages, TUseMessageClickManagement, TUseMessagesManagement } from "../types";
import { IChatHeader, IMessage } from "../interfaces";
import { removeMessageFromUnreaded, updateChatHeader, updateMessagesList } from "../firebase/chat";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Message from "../components/ChatComponents/Message";
import WaitingSpinner from "../components/SpinnerComponents/WaitingSpinner";

function useContextMenuManagement(){
    const defaultContextMenuState = {
        top: 0,
        left: 0,
        isOpen: false,
        handleDeleteClick: () => {},
        handleEditClick: () => {}  
    }
    const [ContextMenuState, setContextMenuState] = useState<TContextMenu>(defaultContextMenuState);

    useEffect(() => {
        window.addEventListener("click", handleMessageBoxClick);
        return () => {
            window.removeEventListener("click", handleMessageBoxClick);
        }
    }, [])

    function handleMessageBoxClick(){
        setContextMenuState(defaultContextMenuState);
    }

    function ContextMenuComponent(){
        return(
            ContextMenuState.isOpen &&
            <ContextMenu 
                top={ContextMenuState.top} 
                left={ContextMenuState.left} 
                handleDeleteClick={ContextMenuState.handleDeleteClick} 
                handleEditClick={ContextMenuState.handleEditClick} />
        )
    }

    return{
        ContextMenuComponent,
        ContextMenuState,
        setContextMenuState
    }
}

function useMessagesManagement(
    {creationDateUserChatHeader, userChatHeader, friendChatHeader, currentUser, currentChat} : TUseMessagesManagement
){
    const defaultMessagesState = {
        allMessages : [],
        visibleMessages : []
    }
    const [messagesState, setMessagesState] = useState<TMessagesState>(defaultMessagesState);
    const [displaySpinner, setDisplaySpinner] = useState<boolean>(false);
    const [scrollState, SetScrollState] = useState<TScrollIntoViewMessages>({
        ScrollIntoView : true,
        lastMessageinSlice : undefined
    });
    const MessagesPerSlice = 15;
    const messagesBoxRef = useRef() as React.RefObject<HTMLDivElement>;

    function isMessageReaded(renderedMessageID : string, senderID : string){
        const defineIfMessageReaded = (validChatHeader : IChatHeader | undefined) => {

          if(!validChatHeader) return true;
    
          if(!validChatHeader.unreadedMessages) return true;

          return !validChatHeader.unreadedMessages.some(messageID => messageID == renderedMessageID);
        }
        let isMessageReaded = false;
    
        switch(senderID){
          case currentUser.uid:
            isMessageReaded = defineIfMessageReaded(friendChatHeader);
            break;
          case currentChat.user.uid:
            isMessageReaded = defineIfMessageReaded(userChatHeader);
            break;
          default:
            console.log(`Error while defining sender ID for a message: ${renderedMessageID}`);
        }
    
        return isMessageReaded;
    }
    
    function handleMarkMessageAsReaded(messageIDToDelete : string){
        console.log(messageIDToDelete);
        if(!currentChat?.unreadedMessages) return;
    
        removeMessageFromUnreaded(currentUser.uid, currentChat.chatID, messageIDToDelete, currentChat.unreadedMessages);
    }

    function MessagesList(handleRightClick : TMessage["handleRightClick"], ContextMenuState : TContextMenu){

        return(
            !currentChat.chatID
            ?
            <div className="chat-empty-content">Pick a friend to start a dialog</div>
            :
            messagesState.visibleMessages.map((message) => (
            <Message 
                message={message} 
                isReaded={isMessageReaded(message.id, message.senderID)} 
                handleMarkMessageAsReaded={handleMarkMessageAsReaded}
                handleRightClick={handleRightClick}
                ContextMenuState={ContextMenuState}
                scrollState={scrollState}
            />
            ))
        )
    }

    function WaitingSpinnerComponent(){
        return(
            displaySpinner ? 
            <div className="messages-wait-spinner-box">
                <WaitingSpinner />
            </div> 
            : null
        )
    }

    function addNextMessageSlice(){
        const visibleMesCount = messagesState.visibleMessages.length;
        const newSlices = messagesState.allMessages.slice(-(visibleMesCount + MessagesPerSlice));
        setMessagesState(prevState => ({
            ...prevState,
            visibleMessages : newSlices
        }));
    }

    function isNeededToAddSlice(){
        return messagesBoxRef.current?.scrollTop != 0 || 
            messagesState.visibleMessages.length < MessagesPerSlice || 
            messagesState.visibleMessages.length == messagesState.allMessages.length;
    }

    function handleMessagesScroll(evt: React.UIEvent<HTMLDivElement, UIEvent>){
        if(isNeededToAddSlice()) return;
        setDisplaySpinner(true);
        setTimeout(() => {
            if(scrollState.ScrollIntoView) SetScrollState({ScrollIntoView: false, lastMessageinSlice: messagesState.visibleMessages.at(0)});
            addNextMessageSlice();
            setDisplaySpinner(false);
        }, 2500);
    }

    /**
     * get all messages
     */
    useEffect(() => {

        const getMessages = function(){
            const unsub = onSnapshot(doc(db, "chats", currentChat.chatID), (document) => {
                const response : IMessage[] = document.exists() && 
                document.data()["messages"]
                ?.reduce((validMessages : IMessage[], message : IMessage) => { 
                    if(message.date.toDate() > creationDateUserChatHeader!.toDate()){
                        validMessages.push({
                            senderID: message.senderID,
                            text: message.text,
                            documents : message.documents,
                            images: message.images,
                            id: message.id,
                            date: message.date
                        });
                    }

                    return validMessages;
                }, []);

                if(response.length > 0){
                    SetScrollState({ScrollIntoView: true, lastMessageinSlice: undefined});
                    setMessagesState({
                        allMessages: response,
                        visibleMessages : response.slice(-MessagesPerSlice)
                    });
                }
            });

            return () => {
                unsub();
            }
        }

        if(creationDateUserChatHeader && currentChat.chatID){
            getMessages();
        }else{
            setMessagesState(defaultMessagesState);
        }

    }, [currentChat.chatID, creationDateUserChatHeader])

    // useEffect(() => {
    //     if(messagesState.visibleMessages.length == 0) return;
    //     const newState = messages.map(message => ({...message, isReaded: true}));
    //     setMessages(newState);
    // }, [userChatHeader || friendChatHeader])

    return {setMessagesState, messages : messagesState.visibleMessages, MessagesList, handleMessagesScroll, messagesBoxRef, WaitingSpinner : WaitingSpinnerComponent};
}

function useMessageClickManagement({userChatHeader, friendChatHeader, currentChat, currentUser, setContextMenuState, messages} : TUseMessageClickManagement){
   
    function handleRightClick(pageX : number, pageY : number, messageID : string, senderID : string, isSelectedMessageReaded : boolean){
        
        const handleDeleteClick = async () => {
          const deleteSelectedMessageFromUnreaded = async () => {
            if(!friendChatHeader?.unreadedMessages) return;
    
            if(isSelectedMessageReaded) return;
            removeMessageFromUnreaded(currentChat.user.uid, currentChat.chatID, messageID, friendChatHeader.unreadedMessages);
          };
          const removeSelectedMessage = () => {
            const newMessagesList = messages.filter(message => message.id !== messageID);
            updateMessagesList(currentChat.chatID, newMessagesList);
            return newMessagesList;
          }
    
          deleteSelectedMessageFromUnreaded();
          const newMessagesList = removeSelectedMessage();
          updateLastMessage(newMessagesList, messageID);
    
          setContextMenuState(prevState => ({...prevState, isOpen: false}));
        }
        
        const handleEditClick = async () => {
          console.log("Edit");
          if(currentUser.uid !== senderID) return;
          setContextMenuState(prevState => ({...prevState, isOpen: false}));
        }
    
        setContextMenuState({
          top: pageX,
          left: pageY,
          isOpen: true,
          handleDeleteClick,
          handleEditClick
        });
    
    }
    
    function updateLastMessage(newMessagesList : IMessage[], deletedMessageID : string){
        const lastMessage = newMessagesList.at(-1) || {};
        // console.log("lastMessage");
        // console.log(userChatHeader);
        //console.log(userChatHeader?.lastMessage.id == deletedMessageID);
        if(userChatHeader?.lastMessage.id == deletedMessageID && currentChat.chatID){
          const chatHeaderUser = {
            [currentChat.chatID + ".lastMessage"] : lastMessage
          };
          updateChatHeader(userChatHeader.uid, chatHeaderUser);
        }
        //console.log(friendChatHeader?.lastMessage.id == deletedMessageID);
        if(friendChatHeader?.lastMessage.id == deletedMessageID && currentChat.chatID){
          const chatHeaderUser = {
            [currentChat.chatID + ".lastMessage"] : lastMessage
          };
          //console.log("update 2");
          updateChatHeader(friendChatHeader.uid, chatHeaderUser);
          //console.log("update 2 end");
        }
    } 

    return {
        handleRightClick
    }
}



export {
    useContextMenuManagement,
    useMessagesManagement,
    useMessageClickManagement
}