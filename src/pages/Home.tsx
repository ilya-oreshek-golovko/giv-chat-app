import Sidebar from '../components/SidebarComponents/Sidebar';
import Chat from '../components/ChatComponents/Chat';
import SelectedFiles from '../components/ChatComponents/SelectedFiles';

export default function Home() {

  return (
    <div className='home-screen'>
      <Sidebar />
      <Chat />
      <SelectedFiles />
      {/* <SelectedFiles modalState={state.isModalOpen} images={state.images} documents={state.documents} handleModalView={handleModalView} clearSelectedFiles={clearSelectedFiles} /> */}
    </div>
  )
}
