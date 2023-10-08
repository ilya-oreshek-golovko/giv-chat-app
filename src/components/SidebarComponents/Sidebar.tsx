import {useState } from 'react'
import Navbar from './Navbar'
import Search from './Search'
import {MouseEvent} from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from "../../firebase/auth";
import {login} from '../../routing';
import {AiOutlineArrowLeft, AiOutlineArrowRight} from 'react-icons/ai'
import Friends from './Friends';

export default function Sidebar() {

    const  [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    
    function onLogoutHandler(evt : MouseEvent<HTMLButtonElement>){
        evt.preventDefault();
        logout();
        navigate(login);
    }
    function toggleSidebar(){
        setIsSidebarOpen((currentVal) => !currentVal);
    }

  return (
    <div className={'home-sidebar ' + (isSidebarOpen && "open")}>
        <Navbar />
        <Search />
        <Friends />
        <div className="sidebar-footer">
            <button className='sidebar-btn-logout color-1' onClick={onLogoutHandler}>Logout</button>
        </div>
        {
            isSidebarOpen 
            ? <AiOutlineArrowLeft className='sidebar-btn-toggle open' onClick={toggleSidebar}/>
            : <AiOutlineArrowRight className="sidebar-btn-toggle closed" onClick={toggleSidebar}/>
        }
    </div>
  )
}
