import { Link, useNavigate } from 'react-router-dom'
import Profile from './Profile'
import Personalization from './Personalization'
import { useSelector, useDispatch } from 'react-redux'
import { showSetting, hideSetting } from '../store/settingPageSlice'
import { logoutThunk, disconnectSocketThunk } from '../store/authSlice'
import { FaTimes, } from "react-icons/fa";

const Setting = () => {
  const Navigate = useNavigate()
  const dispatch = useDispatch()
  const activeBar = useSelector(state => state.showSettings.settingPage)
  const handleClick = () => {
    try {
      Navigate("/login")
      dispatch(logoutThunk())
      dispatch(disconnectSocketThunk())
      dispatch(hideSetting())
    } catch (error) {
      throw error
    }
  }
  return (
    <div className='md:w-2xl w-full md:h-11/12 h-full rounded-md bg-base-100 fixed md:absolute md:bottom-5 bottom-0 flex overflow-hidden left-0 md:left-20'>
      <div className="w-1/3 h-full flex flex-col md:p-1.5 bg-base-200">

        <div className="flex-grow">
          <div className='flex flex-col'>
            <Link
              onClick={() => dispatch(showSetting("Profile"))}
              className={`md:p-4 px-2.5 py-4 rounded-md transition-all text-xs md:text-base ease-in-out duration-300 ${activeBar === "Profile" ? "bg-base-300 text-purple-600" : "hover:bg-base-100"
                }`}
            >
              Profile
            </Link>
            <Link
              onClick={() => dispatch(showSetting("Personalization"))}
              className={`md:p-4 px-2.5 py-4 rounded-md transition-all text-xs md:text-base ease-in-out duration-200 ${activeBar === "Personalization" ? "bg-base-300 text-purple-600" : "hover:bg-base-100"
                }`}
            >
              Personalization
            </Link>

          </div>
        </div>

        <div className="w-full hover:bg-red-500/10 transition-all ease-in-out duration-150 rounded-md">
          <button
            onClick={handleClick}
            className="w-full text-red-700 px-1 py-3 md:p-3 hover:text-red-200 transition-all ease-in-out font-semibold rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <div className='w-full h-full bg-base-300'>
        <div className='flex justify-between bg-base-100 items-center p-4 md:p-5'>
          <div className='text-xs md:text-base'>{activeBar}</div>
          <button className='cursor-pointer text-xs md:text-base' onClick={() => dispatch(hideSetting())}>
            <FaTimes />
          </button>
        </div >
        <div className='relative h-full scroll-smooth overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] '>
          {activeBar === "Profile" && <Profile />}
          {activeBar === "Personalization" && <Personalization />}
        </div>

      </div>
    </div>
  )
}

export default Setting