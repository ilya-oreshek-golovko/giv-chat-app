import Sidebar from '../components/SidebarComponents/Sidebar';
import Chat from '../components/ChatComponents/Chat';
import SelectedFiles from '../components/ChatComponents/SelectedFiles';
import { IChatHeader } from '../interfaces';
import { useChats } from '../hooks/hooks';

export default function Home() {
  const receivedChats : IChatHeader[] = useChats();
  
  return (
    <div className='home-screen'>
      <Sidebar receivedChats={receivedChats}/>
      <Chat/>
      <SelectedFiles />
      {/* <SelectedFiles modalState={state.isModalOpen} images={state.images} documents={state.documents} handleModalView={handleModalView} clearSelectedFiles={clearSelectedFiles} /> */}
    </div>
  )
}
