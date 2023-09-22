import React, { useState } from 'react'
import Navbar from './Navbar'
import Search from './Search'
import Friend from './Friend';
import { IFriend } from '../interfaces';
import {MouseEvent} from 'react';
import { useNavigate } from "react-router-dom";
import { logout } from "../firebase/auth";
import {login} from '../routing';
import {AiOutlineArrowLeft, AiOutlineArrowRight} from 'react-icons/ai'


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
    const friends : Array<IFriend> = [];
    // const friends : Array<IFriend> = [
    //     {
    //         name: "Test 1",
    //         img: 'https://i.pinimg.com/originals/a3/a1/81/a3a181109ddb1aedbd808256706b5bf6.jpg',
    //         chat: [],
    //         id: 1
    //         ///lastMessage: "last mes 1"
    //     },
    //     {
    //         name: "Test 2",
    //         img: 'https://i.pinimg.com/originals/a3/a1/81/a3a181109ddb1aedbd808256706b5bf6.jpg',
    //         chat: [],
    //         id: 2
    //     },
    //     {
    //         name: "Test 3 333333333333333333333333333333333333 22222222222222222222222222",
    //         img: 'https://i.pinimg.com/originals/a3/a1/81/a3a181109ddb1aedbd808256706b5bf6.jpg',
    //         chat: [],
    //         id: 3
    //     },
    //     {
    //         name: "Test 4",
    //         img: 'https://i.pinimg.com/originals/a3/a1/81/a3a181109ddb1aedbd808256706b5bf6.jpg',
    //         chat: [],
    //         id: 4
    //     }
    // ];
  return (
    <div className={'home-sidebar ' + (isSidebarOpen && "open")}>
        <Navbar />
        <Search />
        <div className='sidebar-friends'>
        {
            friends.length > 0 &&
            friends.map((friend) => (
                <Friend key={friend.id} friendName={friend.name} lastMessage={"test mes 1"} src={friend.img}/>
            ))
        }
        </div>
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
