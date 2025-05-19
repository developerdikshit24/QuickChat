import { useState, useRef, useEffect } from 'react';
import { useSelector } from "react-redux";
import NoChatSelected from "../components/NoChatSelected.jsx"
import ChatContainer from '../components/ChatContainer.jsx';
import SideBar from '../components/SideBar.jsx';
import AllUser from '../components/AllUser.jsx';
import QuickAi from '../components/QuickAi.jsx';

const Home = () => {
    const chatMenu = useRef(null)
    const [chatOption, setChatOption] = useState(false)
    const selectedChat = useSelector(state => state.Chat.selectedUser);
    const activeTab = useSelector(state => state.Chat.activeTab);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatMenu.current && !chatMenu.current.contains(event.target)) {
                setChatOption(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
    }, [chatOption]);

    return (
        <div className='flex w-full h-screen justify-center items-stretch gap-5 p-2 md:p-5'>

            <div className='flex flex-1 overflow-hidden gap-3'>
                {activeTab === 'Chat' && <SideBar />}
                {activeTab === 'AddUser' && <AllUser />}
                {activeTab === 'QuickAi' && <QuickAi />}
                <div className="flex-1 overflow-y-auto">
                    {selectedChat ? <ChatContainer /> : <NoChatSelected />}
                </div>
            </div>

            {/* <Footer /> can go here if needed, it'll always stick to the bottom */}
        </div>

        // <div className='flex w-full h-screen justify-center items-stretch gap-5 p-2 md:p-5'>

        //     {activeTab === 'Chat' && <SideBar />}
        //     {activeTab === 'AddUser' && <AllUser />}
        //     {activeTab === 'QuickAi' && <QuickAi />}
        //     {selectedChat ? <ChatContainer /> : <NoChatSelected />}

        // </div>
    );
}

export default Home;
