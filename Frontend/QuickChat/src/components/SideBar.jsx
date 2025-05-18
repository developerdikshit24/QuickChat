import { useState, useEffect } from 'react';
import { diselectChat, getSideBarMsgThunk, selectedUser } from '../store/ChatSlice.js';
import { useDispatch, useSelector } from "react-redux";
import { getDate } from "../constant.js"
import ScreenLoader from './ScreenLoader.jsx';
const SideBar = () => {
    const dispatch = useDispatch();
    const { onlineUsers } = useSelector(state => state.auth)
    const selectedUserData = useSelector(state => state.Chat.selectedUser);
    const sideBarUser = useSelector(state => state.Chat.messages)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        dispatch(getSideBarMsgThunk())
            .then(() => {
                setLoading(false)
            })
    }, [dispatch])

    const handelSelectedUser = (userId) => {
        dispatch(diselectChat())
        const User = sideBarUser.find(item => item._id === userId)
        dispatch(selectedUser(User))

    }
    if (loading) return <ScreenLoader />
    return (
        <div className={`md:h-full h-11/12 relative rounded-md bg-base-300 text-base-content transition-all duration-300 ease-in-out ${selectedUserData ? 'hidden xl:block w-4/12' : 'block w-full xl:w-4/12'}`}>
            <div className='flex flex-col h-full '>
                <div className='flex-shrink-0 '>
                    <div className='px-1 lobster-regular  pb-8 mt-6 justify-between w-full h-20 text-4xl pl-4 font-semibold flex items-center'>
                        QuickChat
                    </div>
                    <div className='flex justify-between pl-4 mb-6 items-center'>
                        <div className='text-xl font-bold'>Chats</div>
                    </div>
                </div>

                <div className='flex-1 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                    {sideBarUser.map((item) => (
                        <div
                            key={item._id}
                            onClick={() => handelSelectedUser(item._id)}
                            className={`cursor-pointer transition-all  border-y duration-200 ease-in-out rounded-md px-3 py-2 mt-2 
                          ${selectedUserData?._id === item._id ? "bg-base-100 border-base-300" : "hover:bg-base-200 border-purple-950"}`}
                        >
                            <div className="flex items-center gap-3 h-[72px]">
                                <div className="relative flex-shrink-0 w-[49px] h-[49px]">
                                    <img
                                        src={item?.profilePicture}
                                        alt="profile"
                                        className="w-full h-full object-cover rounded-full"
                                        draggable={false}
                                    />
                                    {(onlineUsers.includes(item._id) || item.status === "Online") ? <span className="absolute w-3.5 h-3.5 top-0 right-0 bg-green-500 border-2 border-white rounded-full animate-pulse"></span> :""
                                    }
                                </div>

                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-sm md:text-base font-medium truncate text-base-content">
                                            {item.name}
                                        </h2>
                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                            {getDate(item.lastSeen)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between w-3xs items-center mt-0.5">
                                        <p className="text-xs text-base-content/60 truncate w-5/6">
                                            {item.lastMessage || "No messages yet."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default SideBar