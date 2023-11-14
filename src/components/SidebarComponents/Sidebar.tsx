import {useState } from 'react'
import Navbar from './Navbar'
import Search from './Search'
import {MouseEvent} from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from "../../firebase/auth";
import {login} from '../../routing';
import {AiOutlineArrowLeft, AiOutlineArrowRight} from 'react-icons/ai'
import Friends from './Friends';
import { IChatHeader } from '../../interfaces';

export default function Sidebar({receivedChats}:{receivedChats : IChatHeader[]}) {

    const  [isSidebarOpen, setIsSidebarOpen] = useState(false);
    // const receivedChats : IChatHeader[] = useChats();
    const navigate = useNavigate();
    
    function onLogoutHandler(evt : MouseEvent<HTMLButtonElement>){
        evt.preventDefault();
        logout();
        navigate(login);
    }
    function toggleSidebar(){
        setIsSidebarOpen((currentVal) => !currentVal);
    }

    console.log(receivedChats);

  return (
    <div className={'home-sidebar ' + (isSidebarOpen && "open")}>
        <Navbar />
        <Search receivedChats={receivedChats}/>
        <Friends receivedChats={receivedChats}/>
        <div className="sidebar-footer">
            <button className='btn-sidebar-logout color-1' onClick={onLogoutHandler}>Logout</button>
        </div>
        {
            isSidebarOpen 
            ? <AiOutlineArrowLeft className='btn-sidebar-toggle open' onClick={toggleSidebar}/>
            : <AiOutlineArrowRight className="btn-sidebar-toggle closed" onClick={toggleSidebar}/>
        }
    </div>
  )
}
