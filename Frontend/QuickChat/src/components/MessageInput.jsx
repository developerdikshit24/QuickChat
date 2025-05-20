import { useRef, useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { listenMsg, sendMsgThunk } from "../store/ChatSlice.js"
import { useSelector, useDispatch } from 'react-redux'
const MessageInput = () => {
    const dispatch = useDispatch()
    const { handleSubmit, register, reset, watch,  } = useForm()
    const [imagePreview, setImagePreview] = useState("")
    const [originalUrl, setOriginalUrl] = useState({})
    const fileInputRef = useRef(null)
    const sendMsgUser = useSelector(state => state.Chat.selectedUser)
    const [imgLoading, setImgLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const text = watch("content")
    const handleClick = () => {
        setImagePreview("")
        setOriginalUrl("")
        fileInputRef.current.click();
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setOriginalUrl(file)
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        e.target.value = null;
    }
    const handleSendMsg = (data) => {
        reset()
        setLoading(true)
        setImgLoading(true)
        dispatch(sendMsgThunk({ user: sendMsgUser._id, data: { content: data.content, media: originalUrl } }))
            .then(() => {
                setImgLoading(false)
                setLoading(false)
                setImagePreview("")
                setOriginalUrl("")
            })
    }
    return (
        <div className='sticky bottom-0  left-0 rounded-md  right-0 bg-base-100 p-4 border-t border-base-200'>
            {imagePreview && <div className='max-w-28 flex justify-center  max-h-28 bg-base-300 mb-4 relative rounded-md'>
                <img className='max-h-28 rounded-md bg-center max-w-28 overflow-hidden' src={imagePreview} alt="ImgPreview" />
                <div onClick={() => { setImagePreview(""), setOriginalUrl("") }} className='bg-black/70 cursor-pointer z-40 absolute -top-2 text-white -right-2 p-1 rounded-full'><FaTimes /></div>
                {imgLoading && <div className='bg-black/50 w-full h-full rounded-md  top-1/2 left-1/2 transform -translate-1/2  absolute '><span className="loading top-1/2 left-1/2 transform -translate-1/2  absolute   loading-spinner loading-md"></span></div>}
            </div>}

            <form onSubmit={handleSubmit(handleSendMsg)} className='flex items-center gap-3'>
                <input
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className='hidden'
                    type="file"
                    disabled={sendMsgUser.name === "QuickChat AI"}
                />

                <button type="button" onClick={handleClick} className=''>
                    <img className='dark:invert dark:brightness-0  dark:hue-rotate-180 w-9 h-9 md:w-10 md:h-10 cursor-pointer'  src="images/Media.png" alt="Attach media" />
                </button>

                <input
                    type="text"
                    placeholder="Type a message..."
                    className='flex-1 input w-full h-9 md:h-10 bg-base-200 focus:outline-none'
                    {...register('content')}
                />

                <button type="submit" disabled={loading || !(text?.trim() || imagePreview)} className='btn cursor-pointer bg-purple-700 btn-circle w-9 h-9  md:w-12 md:h-12'>
                    {loading ? <span className="loading loading-spinner loading-md text-white"></span> : <img src="images/SendMsg.png" className='invert w-5 h-5 md:w-6 md:h-6' alt="Send message" />}
                </button>
            </form>


        </div>
    )
}

export default MessageInput