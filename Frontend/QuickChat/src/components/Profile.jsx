import { useState, useRef, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateDetailsThunk, updateProfilePictureThunk } from "../store/authSlice.js";
import Cropper from "react-easy-crop";
import { FaPlus, FaCheck, FaTimes } from "react-icons/fa";
import getCroppedImg from "../constant.js";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { AiOutlineEdit } from "react-icons/ai";
const Profile = () => {
  const userData = useSelector((state) => state.auth.userData);
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const dispatch = useDispatch()
  const [inputDisable, setInputDisable] = useState({
    field1: true,
    field2: true,
  });
  const [shouldShowBtn, setShouldShowBtn] = useState(false);
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    setLoading(true)
    if (userData) {
      setValue('name', userData.name);
      setValue('bio', userData.bio);
    }
    setLoading(false)
  }, [userData, setValue]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      };
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropDone = async () => {
    try {
      setLoading(true)
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      const file = new File([croppedImageBlob], "profilePicture.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append('profilePicture', file);
      setShowCropper(false);
      await dispatch(updateProfilePictureThunk(formData))
      setLoading(false)
    } catch (error) {
      toast.error("Server Error")
    }
  };


  const handleCropCancel = () => {
    setShowCropper(false);
  };

  const toggleField = (fieldName) => {
    setInputDisable(prev => {
      const updated = {
        ...prev,
        [fieldName]: !prev[fieldName]
      };
      const anyFieldEnabled = Object.values(updated).some(val => val === false);
      setShouldShowBtn(anyFieldEnabled);
      return updated;
    });
  };

  const updateUserDetails = async (data) => {
    try {
      setLoading(true);
      dispatch(updateDetailsThunk(data));
      setShouldShowBtn(false);
      setInputDisable(prev => {
        const updated = {};
        Object.keys(prev || {}).forEach(key => {
          updated[key] = true;
        });
        return updated;
      });
    } catch (error) {
      toast.error("Failed to update user details");
    } finally {
      setLoading(false);
    }
  };



  return (

    <div className="h-full">
      <div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className='hidden' />
        <div className='flex justify-center mt-7'>
          <div className='relative w-20 h-20 md:w-28 md:h-28 rounded-full'>
            <img
              className='w-full h-full object-cover rounded-full'
              src={userData.profilePicture}
              alt="Profile"
            />

            {loading && (
              <div className='absolute inset-0 bg-black/50 rounded-full flex items-center justify-center z-40'>
                <span className="loading loading-spinner loading-md text-primary"></span>
              </div>
            )}

            <button
              className='absolute z-50 text-sm md:text-xl cursor-pointer text-white right-0 bottom-0 bg-purple-700 rounded-full p-2'
              onClick={handleClick}
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </div>


      {showCropper && (
        <div className='fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50'>
          <div className='relative w-80 h-80 bg-gray-900 rounded-lg overflow-hidden'>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape="rect"
              showGrid={false}
            />
          </div>
          <div className='flex gap-8 mt-4 text-white'>
            <button className='p-2 rounded-full' onClick={handleCropCancel}><FaTimes /></button>
            <button className='p-2 rounded-full' onClick={handleCropDone}><FaCheck /></button>
          </div>
        </div>
      )}

      <div >
        <form onSubmit={handleSubmit(updateUserDetails)} className="flex flex-col justify-center items-center mt-8 pb-28">
          <label className='w-10/12 sm:sm:text-xxs md:text-base'>
            {"Name"}
            <label className={`input px-0 bg-base-300 h-7 md:h-10  border-2  w-full validator mt-2 mb-7 md:mb-12`}>
              <input {...register('name', { required: "Name is required" })} type={"text"} disabled={inputDisable?.field1} className={`p-2 bg-base-300 sm:text-xxs md:text-base border-none focus:outline-none`} />
              <AiOutlineEdit onClick={() => { toggleField('field1') }} className={`md:mr-3.5 mr-1.5 md:ml-2 cursor-pointer`} />
            </label>
          </label>

          <label className='w-10/12 sm:text-xxs md:text-base'>
            {"Bio"}
            <label className={`input px-0 h-7 md:h-10 cursor-pointer  border-2 bg-base-300  w-full validator mt-2 mb-7 md:mb-12`}>
              <input {...register('bio')} type={"text"} disabled={inputDisable?.field2} className={`p-2 bg-base-300 sm:text-xxs md:text-base border-none focus:outline-none`} />
              <AiOutlineEdit onClick={() => { toggleField('field2') }} className={`md:mr-3.5 mr-1.5 md:ml-2 cursor-pointer`} />
            </label>
          </label>

          <label className='w-10/12 sm:text-xxs md:text-base'>
            {"Number"}
            <label className={`input px-0 h-7 md:h-10 bg-base-300 border-2 w-full validator mt-2 mb-7 md:mb-12`}>
              <input disabled type={"text"} value={"+91 " + userData.number} className={`p-2 bg-base-300 sm:text-xxs md:text-base border-none focus:outline-none`} />
            </label>
          </label>

          <label className='w-10/12 sm:text-xxs md:text-base'>
            {"Email"}
            <label className={`input px-0 h-7 md:h-10  bg-base-300 border-2 w-full mt-2  mb-7 md:mb-12`}>
              <input disabled type={"text"} value={userData.email} className={`p-2 bg-base-300 sm:text-xxs md:text-base border-none focus:outline-none`} />
            </label>
          </label>

          {shouldShowBtn && <button type="submit" className="bg-purple-800 text-white sm:text-xxs md:text-base px-8 py-2 md:py-3 rounded-lg">Save</button>}
        </form>
      </div>
    </div>
  );
};

export default Profile;