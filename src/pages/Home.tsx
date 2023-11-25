import Sidebar from '../components/SidebarComponents/Sidebar';
import Chat from '../components/ChatComponents/Chat';
import SelectedFiles from '../components/PopupComponents/SelectedFiles';
import { IChatHeader } from '../interfaces';
import { useChats } from '../hooks/hooks';

export default function Home() {
  // const currentUser = useContext(AuthContext);
  const receivedChats : IChatHeader[] = useChats();
  
  return (
    <div className='home-screen'>
      <Sidebar receivedChats={receivedChats}/>
      <Chat/>
      <SelectedFiles />
    </div>
  )
}
