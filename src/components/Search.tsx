import React, { useRef } from 'react'

export default function Search() {
  const findUserInput = useRef() as React.RefObject<HTMLInputElement>;

  return (
    <div className='home-search'>
      <input type="text" ref={findUserInput} className='search-input' placeholder='Find a friend'/>
    </div>
  )
}
