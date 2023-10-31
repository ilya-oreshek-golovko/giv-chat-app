import React from 'react'

export default function Wrapper({children} : {children : any}) {
  return (
    <div className='wrapper'>
        {children}
    </div>
  )
}
