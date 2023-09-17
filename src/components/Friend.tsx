import React from 'react'
import { FriendProps } from '../types'

export default function Friend({key, friendName, lastMessage, src} : FriendProps) {
  return (
    <div className='home-friend' key={key}>
        <div className='friend-img-box'>
          <img src={src} alt="friend" className='friend-img'/>
        </div>
        <div className='friend-content-box'>
          <h3 className='friend-title'>{friendName}</h3>
          <p className='friend-description'>{lastMessage}</p>
        </div>
    </div>
  )
}
