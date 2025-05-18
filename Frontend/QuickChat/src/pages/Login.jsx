import { useState } from 'react'
import Input from '../components/Input'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import AuthImagePattern from "../components/AuthImagePattern.jsx"
import { useDispatch } from 'react-redux'
import { loginThunk } from '../store/authSlice.js';
import toast from 'react-hot-toast'
import { extractErrorMessage } from '../constant.js'
import ScreenLoader from '../components/ScreenLoader.jsx'
import { MessageSquare } from "lucide-react";

const Login = () => {
  const [Loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { register, handleSubmit, reset } = useForm()
  const Navigate = useNavigate()
  const loginUser = async (data) => {
    setLoading(true)
    try {
      dispatch(loginThunk(data))
      Navigate("/")
    } catch (error) {
      toast.error(extractErrorMessage(error.response.data))
    } finally {
      reset()
      setLoading(false)
    }
  }

  return (
    <>
      {Loading && <ScreenLoader />}
      <div className='w-full h-screen fixed'>
        <div className="w-full">
          <div className=" w-full flex-row justify-center h-screen items-center flex">
            <div className='w-6/12 hidden lg:block h-screen bg-base-300'>
              <AuthImagePattern title={"Welcome back..!"}
                subtitle={"Dive into your conversations, reconnect with your friends, and never miss a moment."}
              /></div>
            <div className=' w-full lg:w-6/12 flex flex-col h-screen bg-base-100 justify-center items-center'>
              <div className='flex justify-center md:w-3/5 xl:1/3 items-center flex-col'>
                <div className="flex justify-center gap-4 mb-4">
                  <div className="relative">
                    <div
                      className="w-16 h-16 rounded-2xl p bg-primary/10 flex items-center justify-center"
                    >
                      <MessageSquare className="w-8 h-8 text-primary " />
                    </div>
                  </div>
                </div>
                <div className='lg:text-4xl text-2xl mb-2.5 mt-2.5  font-bold'>Login Account</div>
                <p className='text-base-content/60 text-xs md:text-base mb-6'>Check New Message and stay connected</p>
                <form className='w-full' onSubmit={handleSubmit(loginUser)}>
                  <fieldset className="fieldset">
                    <Input
                      {...register('number', { required: "Number is required" })}
                      label="Number"
                      placeholder="9897198971"
                      autoComplete={"number"}
                      size="0 0 14 14"
                      icon={<g fill="none">
                        <path
                          d="M7.25 11.5C6.83579 11.5 6.5 11.8358 6.5 12.25C6.5 12.6642 6.83579 13 7.25 13H8.75C9.16421 13 9.5 12.6642 9.5 12.25C9.5 11.8358 9.16421 11.5 8.75 11.5H7.25Z"
                          fill="currentColor"
                        ></path>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M6 1C4.61929 1 3.5 2.11929 3.5 3.5V12.5C3.5 13.8807 4.61929 15 6 15H10C11.3807 15 12.5 13.8807 12.5 12.5V3.5C12.5 2.11929 11.3807 1 10 1H6ZM10 2.5H9.5V3C9.5 3.27614 9.27614 3.5 9 3.5H7C6.72386 3.5 6.5 3.27614 6.5 3V2.5H6C5.44771 2.5 5 2.94772 5 3.5V12.5C5 13.0523 5.44772 13.5 6 13.5H10C10.5523 13.5 11 13.0523 11 12.5V3.5C11 2.94772 10.5523 2.5 10 2.5Z"
                          fill="currentColor"
                        ></path>
                      </g>}
                      ErrorMsg="Must be 10 digits"
                      type="input"
                      pattern="[0-9]*"
                    />
                    <Input
                      {...register('password', { required: "Password is required" })}
                      label="Password"
                      placeholder="******"
                      autoComplete="username"
                      size="0 0 24 24"
                      icon={< g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                        ></path>
                        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                      </g>}
                      ErrorMsg="Must be more than 8 characters, Include 1 Capital letter & Number*"
                      type="password"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    />
                    <button type='submit' className="btn mb-1.5 w-full btn-primary">Login</button>
                    <p className='text-center'>Don't have an account? <Link to={"/signup"} className='text-primary cursor-pointer active:text-purple-800'>Sign Up</Link></p>
                  </fieldset>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Login