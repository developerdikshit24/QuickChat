import { useSelector, useDispatch } from 'react-redux';
import { getDate } from '../constant.js'
import { diselectChat, getAllUserThunk, selectedUser } from '../store/ChatSlice.js';
import { useEffect } from 'react';
const QuickAi = () => {
    const dispatch = useDispatch()
    const { allUsers } = useSelector(state => state.Chat);
    const selectedUserData = useSelector(state => state.Chat.selectedUser);
    useEffect(() => {
        dispatch(getAllUserThunk())
    }, [])
    const handelSelectedUser = (userName) => {
        dispatch(diselectChat())
        const User = allUsers.find(item => item.name === userName)
        dispatch(selectedUser(User))
    }
    return (
        <div className={`md:h-full h-11/12 relative rounded-md bg-base-300 text-base-content transition-all duration-300 ease-in-out ${selectedUserData ? 'hidden xl:block w-4/12' : 'block w-full xl:w-4/12'}`}>
            <div className='flex flex-col h-full '>
                <div className='flex-shrink-0 '>
                    <div className='px-1 lobster-regular  pb-8 mt-6 justify-between w-full h-20 text-4xl pl-4 font-semibold flex items-center'>
                        QuickChat
                    </div>
                    <div className='flex justify-between pl-4 mb-6 items-center'>
                        <div className='text-xl font-bold'>Chat With AI</div>
                    </div>
                </div>

                <div className='flex-1 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
                    <div
                        onClick={() => handelSelectedUser("QuickChat AI")}
                        className={`cursor-pointer transition-all  border-y duration-200 ease-in-out rounded-md px-3 py-2 mt-2 hover:bg-base-200 border-purple-950`}
                    >
                        <div className="flex items-center gap-3 h-[72px]">
                            <div className="relative flex-shrink-0 w-[49px] h-[49px]">
                                <img
                                    src={"https://res.cloudinary.com/dcehtpeqy/image/upload/v1747242632/roy5tquilntpl3x8jzbw.jpg"}
                                    alt="profile"
                                    className="w-full h-full object-cover rounded-full"
                                    draggable={false}
                                />
                                <span className="absolute w-3.5 h-3.5 top-0 right-0 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
                            </div>

                            <div className="flex-1 overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-sm md:text-base font-medium truncate text-base-content">
                                        {"QuickChat AI"}
                                    </h2>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">
                                        {getDate(new Date().toISOString())}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center mt-0.5">
                                    <p className="text-xs text-base-content/60 truncate w-5/6">
                                        {'Your Personal AI Assistant'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuickAi