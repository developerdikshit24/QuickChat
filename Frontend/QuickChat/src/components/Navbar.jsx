import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Setting from "../components/Setting.jsx";
import { showSetting } from '../store/settingPageSlice.js';
import { activeTab } from '../store/ChatSlice.js';
import { FaUserPlus } from 'react-icons/fa';
import { RiChatSmileAiLine } from "react-icons/ri";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
const Navbar = () => {
  const dispatch = useDispatch()
  const selectedChat = useSelector(state => state.Chat.selectedUser)
  const LogUser = useSelector(state => state.auth.userData)
  const clickSetting = useSelector(state => state.showSettings.showSetting)

  return (
    <div className={`
      ${selectedChat ? "hidden xl:flex" : "flex"}
      fixed md:static  bg-purple-950 text-base-content z-50
      w-full h-16 rounded-tl-3xl md:rounded-xs rounded-tr-3xl bottom-0 flex-row
      md:w-16 md:h-screen md:top-0 md:left-0 md:bottom-auto md:flex-col
      `}>
      <div className='flex flex-1 md:flex-col md:w-full md:justify-between md:h-full md:overflow-y-auto'>
        <div className='flex md:flex-col md:ml-3 gap-[11%] md:gap-9 md:w-3/5 w-full items-center justify-center md:mt-8'>
          <Link className='lobster-regular hidden md:block text-white text-5xl' to={"/"}>
            Q
          </Link>
          <Link className=' p-1.5 hover:bg-purple-500/30 rounded-md active:bg-purple-500/50' onClick={() => { dispatch(activeTab('Chat')) }}>
            <IoChatbubbleEllipsesOutline className='text-white w-10 h-10 md:w-8 md:h-8 object-contain flex-1 ' src="/images/message.png" alt="message" />
          </Link>
          <Link className=' p-1.5 hover:bg-purple-500/30 rounded-md active:bg-purple-500/50' onClick={() => { dispatch(activeTab('AddUser')) }}>
            <FaUserPlus className='text-white ml-1 w-10 h-10 md:w-8 md:h-8 text-center' />
          </Link>
          <Link className="flex p-1.5 hover:bg-purple-500/30 rounded-md active:bg-purple-500/50  justify-center items-center md:flex-none" onClick={() => { dispatch(activeTab('QuickAi')) }}>
            <RiChatSmileAiLine src="/images/Story.png" className='w-10 h-10 md:w-8 md:h-8 text-white' alt="" />
          </Link>
          <Link className=' p-1.5 hover:bg-purple-500/30 md:hidden rounded-md active:bg-purple-500/50' onClick={() => (dispatch(showSetting("Profile")))} >
            <img className='rounded-full w-10 h-10 object-contain flex-1' src={LogUser?.profilePicture || "/images/defaultProfilePic.jpg"} alt="user" />
          </Link>
        </div>
        <div className='md:flex md:flex-col hidden  gap-6 w-2/6 items-center md:w-full justify-center md:mb-8'>
          <Link className=' p-1.5 hover:bg-purple-500/30 rounded-md active:bg-purple-500/50' onClick={() => (dispatch(showSetting("Personalization")))} >
            <img className=' hidden invert w-10 h-10 md:w-8 md:h-8 md:block' src="/images/Setting.png" alt="setting" />
          </Link>
          <Link className=' p-1.5 hover:bg-purple-500/30 rounded-md active:bg-purple-500/50' onClick={() => (dispatch(showSetting("Profile")))} >
            <img className='rounded-full w-10 h-10 object-contain flex-1' src={LogUser?.profilePicture || "/images/defaultProfilePic.jpg"} alt="user" />
          </Link>
        </div>
      </div>
      {clickSetting && <Setting />}
    </div>
  )
}

export default Navbar
