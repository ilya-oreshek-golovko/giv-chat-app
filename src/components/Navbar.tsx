import { useContext } from "react"
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {

  const currentUser = useContext(AuthContext);
  console.log(currentUser);
  return (
    <div className='home-navbar'>
      <h2 className='navbar-app-name'>GIV Chat</h2>
      <div className='navbar-owner-box'>
        <img src={currentUser.photoURL} alt="owner" className='navbar-owner-img'/>
        <div className='navbar-owner-name'>{currentUser.displayName}</div>
      </div>
    </div>
  )
}
