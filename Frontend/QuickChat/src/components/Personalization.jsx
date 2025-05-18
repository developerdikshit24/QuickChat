import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setChatBackground } from '../store/themeSlice'

const Personalization = () => {
  const dispatch = useDispatch()
  const reduxBg = useSelector((state) => state.theme.chatBackground)
  const [selectedBg, setSelectedBg] = useState('')

  useEffect(() => {
    setSelectedBg(reduxBg)
  }, [reduxBg])
 
  const backgrounds = [
    { id: '', style: 'bg-base-300' },
    { id: 'bg-gradient-to-bl from-[#d9a4fd55] to-[#df3ff43b]', style: 'bg-gradient-to-bl from-[#d9a4fd55] to-[#df3ff43b]' },
    { id: 'bg-gradient-to-bl  from-[#83cc164c] via-[#16a34a5d] to-[#0f766d85]', style: 'bg-gradient-to-bl from-[#83cc164c] via-[#16a34a5d] to-[#0f766d85]' },
    { id: 'bg-gradient-to-tr from-[#ef444472] via-[#b453096a] to-[#f59f0b73]', style: 'bg-gradient-to-tr from-[#ef444472] via-[#b453096a] to-[#f59f0b73]' },
    { id: 'bg-gradient-to-r from-[#2dd4be59]  to-[#1f293775]', style: 'bg-gradient-to-r from-[#2dd4be59]  to-[#1f293775]' },
    { id: 'bg-gradient-to-r from-[#f6f6d95a] via-[#47e4df55] to-[#5f80e455]', style: 'bg-gradient-to-r from-[#f6f6d95a] via-[#47e4df55] to-[#5f80e455]' }
  ]

  const handleSelect = (bgId) => {
    dispatch(setChatBackground(bgId))
    setSelectedBg(bgId)
  }

  return (
    <div className='p-4'>
      <div className='mb-4'>Chat Background</div>
      <div className='flex flex-wrap gap-2 md:gap-4 p-4 md:p-8'>
        {backgrounds.map((bg, index) => (
          <button
            key={index}
            onClick={() => handleSelect(bg.id)}
            className={`
              md:w-16 md:h-16 h-10 w-10 rounded-md box-border 
              ${bg.style} 
              ${selectedBg === bg.id ? 'ring-2 ring-purple-500' : 'border-1 border-gray-700'}
            `}
          ></button>
        ))}
      </div>
    </div>
  )
}

export default Personalization
