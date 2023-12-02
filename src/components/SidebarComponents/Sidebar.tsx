import Navbar from './Navbar'
import Search from './Search'
import {MouseEvent} from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from "../../firebase/auth";
import {login} from '../../routing';
import Friends from './Friends';
import { IChatHeader } from '../../interfaces';

export default function Sidebar({receivedChats}:{receivedChats : IChatHeader[]}) {
    const navigate = useNavigate();
    
    function onLogoutHandler(evt : MouseEvent<HTMLButtonElement>){
        evt.preventDefault();
        logout();
        navigate(login);
    }

    return (
        <div className='home-sidebar'>
            <Navbar />
            <Search receivedChats={receivedChats}/>
            <Friends receivedChats={receivedChats}/>
            <div className="sidebar-footer">
                <button className='btn-sidebar-logout color-1' onClick={onLogoutHandler}>Logout</button>
            </div>
        </div>
    )
}
