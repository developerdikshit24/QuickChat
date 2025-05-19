import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deletedMsgThunk, diselectChat, listenMsg, offListenMsg } from '../store/ChatSlice.js';
import { getMsgThunk } from "../store/ChatSlice.js"
import MessageInput from './MessageInput.jsx';
import { getDate } from '../constant.js';
import { FaTimes } from 'react-icons/fa';
import { VscArrowSmallLeft } from "react-icons/vsc";
import MessageSkeleton from './MessageSkeleton.jsx';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';


const ChatContainer = () => {
    const dispatch = useDispatch()
    const [userOption, setuserOption] = useState(false);
    const [openImg, setOpenImg] = useState("")
    const menuRef = useRef(null);
    const messageEndRef = useRef(null)
    const selectedChatUser = useSelector(state => state.Chat.selectedUser);
    const userChat = useSelector(state => state.Chat.usersChat)
    const chatTheme = useSelector(state => state.theme.chatBackground)
    const LoggedUser = useSelector(state => state.auth.userData)
    const { onlineUsers } = useSelector(state => state.auth)
    const [clearChatOption, setClearChatOption] = useState(false)
    const [clearChatLoading, setClearChatLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setuserOption(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
    }, [userOption]);

    useEffect(() => {
        setLoading(true)
        dispatch(getMsgThunk(selectedChatUser._id))
            .then(() => {
                setLoading(false)
            })
        dispatch(listenMsg())

        return () => offListenMsg()
    }, [selectedChatUser])

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [userChat, loading]);

    const handleClickImg = (imgSrc) => {
        setOpenImg(imgSrc)
    }
    const handelDelete = () => {
        setClearChatLoading(true)
        dispatch(deletedMsgThunk(selectedChatUser._id)).then(() => {
            setClearChatLoading(false)
            setClearChatOption(false)
        })

    }
    const handleUpComming = () => {
        toast((t) => (
            <span>
               Features <b>Coming Soon! </b>
                <button className='btn btn-ghost' onClick={() => toast.dismiss(t.id)}>
                    Dismiss
                </button>
            </span>
          ));
    }

    if (loading) return <MessageSkeleton />
    return (
        <>
            <div className={`flex-1 overflow-hidden rounded-md relative bg-base-300 text-base-content transition-all duration-300 ease-in-out ${selectedChatUser ? 'block' : 'hidden'} xl:block`}>
                <div className='w-full h-20 bg-purple-950 sticky top-0 z-10'>
                    <div className='p-3'>
                        <div className='flex items-center flex-1 gap-2'>
                            <button onClick={() => dispatch(diselectChat())} className='text-base-content rounded hover:transition'>
                                <VscArrowSmallLeft className='w-12 cursor-pointer text-white hover:bg-purple-500/20 rounded-full h-full' />
                            </button>
                            <img className='rounded-full h-11 w-11 md:h-12 md:w-12' src={`${selectedChatUser.profilePicture}`} alt="" />
                            <div className='w-full flex justify-between items-center'>
                                <div className='flex flex-col'>
                                    <h2 className='text-white md:text-xl text-md'>{selectedChatUser.name}</h2>
                                    <p className='text-fuchsia-50/60 text-xs md:text-sm'>{(onlineUsers.includes(selectedChatUser._id) || selectedChatUser.status == 'Online') ? "Online" : "Offline"}</p>
                                </div>
                                <div>
                                    <button className='hover:bg-purple-500/20 md:p-1 rounded-md' onClick={() => setuserOption(!userOption)}>
                                        <img className='h-6 w-6 md:w-8 md:h-8 cursor-pointer invert' src="/images/Three-Dots.png" alt="" />
                                    </button>
                                </div>
                                {userOption && (
                                    <div ref={menuRef} className='flex flex-col rounded-md overflow-hidden justify-center items-center bg-base-00 z-20 absolute right-5 top-6 shadow-lg transition transform origin-top-right scale-100'>
                                        <button onClick={handleUpComming} className='px-5 py-3 w-full bg-base-300 text-xs pb-3 cursor-pointer hover:text-purple-500 hover:bg-base-100'>View Profile</button>
                                        <button onClick={handleUpComming} className='px-5 py-3 w-full bg-base-300 text-xs pb-3 cursor-pointer hover:text-purple-500 hover:bg-base-100'>Block</button>
                                        <button onClick={() => { setClearChatOption(true); setuserOption(false) }} className='px-5 py-3 w-full bg-base-300 text-xs pb-3 cursor-pointer hover:text-purple-500 hover:bg-base-100'>Clear Chat</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:h-[calc(100vh-7.5rem)] h-[calc(100vh-10rem)]">
                    <div className={`flex-1 overflow-y-auto ${chatTheme} scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
                        <div className="p-4 flex flex-col">
                            {userChat.map((item) => (
                                <div ref={messageEndRef} key={item._id}>
                                    <div className={`chat ${item.senderId === selectedChatUser._id ? 'chat-start' : 'chat-end'}`}>
                                        <div className="chat-image avatar">
                                            <div className="w-10 rounded-full">
                                                <img alt="chat" src={`${item.senderId === selectedChatUser._id ? selectedChatUser.profilePicture : LoggedUser.profilePicture}`} />
                                            </div>
                                        </div>
                                        <div className={`chat-bubble break-words mb-1 ${item.senderId === selectedChatUser._id ? 'bg-[#2e0548] text-white' : 'bg-base-100'}`}>
                                            {item.media && <img onClick={() => { handleClickImg(item.media) }} className='max-w-64 max-h-60 pb-2' src={item.media} alt="" />}
                                            <ReactMarkdown
                                                children={item.content}
                                                components={{
                                                    p: ({ node, ...props }) => <p className="mb-1 break-words" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc list-inside ml-4" {...props} />,
                                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                    pre: ({ node, ...props }) => (
                                                        <pre className="break-words whitespace-pre-wrap bg-gray-800 text-white p-2 rounded-md overflow-x-auto" {...props} />
                                                    ),
                                                    code: ({ node, inline, ...props }) =>
                                                        inline ? (
                                                            <code className="bg-gray-700 select-all text-white px-1 rounded" {...props} />
                                                        ) : (
                                                            <code className="break-words select-all whitespace-pre-wrap" {...props} />
                                                        )
                                                }}
                                            />
                                        </div>
                                        <div className="chat-footer text-xxs opacity-50">Sent at {getDate(item.updatedAt)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="shrink-0">
                        <MessageInput />
                    </div>
                </div>

                {openImg && (
                    <div className='w-full absolute top-0 left-0 flex justify-center items-center h-full bg-black/60 z-30'>
                        <div onClick={() => { setOpenImg("") }} className='absolute cursor-pointer top-0 right-8'>
                            <FaTimes className='w-6 h-6' />
                        </div>
                        <div className='h-full max-w-full p-5 flex'>
                            <img src={openImg} alt="" />
                        </div>
                    </div>
                )}

                {clearChatOption && (
                    <div className='absolute w-full h-screen top-0 left-0 bg-black/35 flex items-center justify-center'>
                        <div className='md:w-2/6 w-4/5 rounded-md border p-4 shadow-xl bg-base-300 backdrop-blur border-purple-900/40'>
                            <h1 className='md:text-xl text-base mb-2'>Do you want to clear this chat?</h1>
                            <p className='md:text-sm text-xxs text-base-content/45'>
                                This will permanently delete the conversation from your chat history.
                            </p>
                            <div className='flex justify-end gap-4 px-2 mt-4'>
                                <button onClick={() => { setClearChatOption(false) }} className='btn btn-ghost'>Cancel</button>
                                <button onClick={handelDelete} className='btn bg-red-800/75 hover:bg-red-800/90'>{clearChatLoading ? <span className="loading loading-spinner loading-sm"></span> : 'Delete'}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </>
    )
}

export default ChatContainer