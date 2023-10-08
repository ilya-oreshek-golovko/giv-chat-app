import Sidebar from '../components/SidebarComponents/Sidebar';
import Chat from '../components/ChatComponents/Chat';

export default function Home() {

  return (
    <div className='home-screen'>
      <Sidebar />
      <Chat />
    </div>
  )
}
