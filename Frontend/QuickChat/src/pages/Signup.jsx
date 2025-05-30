import React from 'react'
import Input from '../components/Input.jsx'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import AuthImagePattern from "../components/AuthImagePattern.jsx"
import { registerThunk } from '../store/authSlice.js';
import toast from 'react-hot-toast'
import { extractErrorMessage } from "../constant.js"
import { MessageSquare } from "lucide-react";
const Signup = () => {
    const dispatch = useDispatch()
    const loading = useSelector(state => state.auth.isAuthenticating)
    const { register, handleSubmit, reset } = useForm()
    const Navigate = useNavigate()
    const createAccount = async (data) => {
        try {
            dispatch(registerThunk(data))
            Navigate("/login")
        } catch (error) {
            toast.error(extractErrorMessage(error.response.data))
        }
        finally {
            reset()
        }
    }
    if (loading) { return <ScreenLoader /> }
    return (
        <div className='w-full h-[100svh] fixed'>
            <div className="w-full">
                <div className=" w-full flex-row justify-center h-screen items-center flex">
                    <div className='w-full lg:w-6/12 flex flex-col h-screen bg-base-100 justify-start lg:justify-center items-center pt-10 lg:pt-0'>
                        <div className="flex justify-center gap-4 mb-4">
                            <div className="relative">
                                <div
                                    className="w-16 h-16 rounded-2xl p bg-primary/10 flex items-center justify-center"
                                >
                                    <MessageSquare className="w-8 h-8 text-primary " />
                                </div>
                            </div>
                        </div>
                        <div className=' text-2xl md:text-4xl mb-1.5 mt-2.5  font-bold'>Create Account</div>
                        <p className='text-base-content/60 text-xs md:text-base'>Get Started with your free account</p>
                        <form className='w-4/5 md:w-7/12' onSubmit={handleSubmit(createAccount)}>
                            <fieldset className="fieldset flex flex-col justify-center items-center">
                                <div className='w-full'>
                                    <Input
                                        {...register('name', { required: "Name is required" })}
                                        label="Name"
                                        placeholder="John Cena"
                                        autoComplete={"username"}
                                        size="0 0 24 24"
                                        icon={<g
                                            strokeLinejoin="round"
                                            strokeLinecap="round"
                                            strokeWidth="2.5"
                                            fill="none"
                                            stroke="currentColor"
                                        >
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </g>}
                                        ErrorMsg="Containing only letters*"
                                        type="input"
                                        pattern="^[A-Za-z]+( [A-Za-z]+)*$*"
                                    />
                                    <Input
                                        {...register('email', { required: "Email is required" })}
                                        label="Email"
                                        placeholder="mail@site.com"
                                        size="0 0 24 24"
                                        autoComplete={"email"}
                                        icon={<g
                                            strokeLinejoin="round"
                                            strokeLinecap="round"
                                            strokeWidth="2.5"
                                            fill="none"
                                            stroke="currentColor"
                                        >
                                            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                        </g>}
                                        ErrorMsg="Enter valid email address"
                                        type="email"
                                    />
                                    <Input
                                        {...register('number', { required: "Number is required" })}
                                        label="Number"
                                        placeholder="9897198971"
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
                                        autoComplete="new-password"
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
                                        ErrorMsg="Must be more than 8 characters"
                                        type="password"
                                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                                    />
                                </div>
                                <button type='submit' className="btn mb-1.5 w-full btn-primary">Signup</button>
                                <p className='text-center'>Have an account? <Link to={"/login"} className='text-primary cursor-pointer active:text-purple-800'>Login now</Link></p>
                            </fieldset>
                        </form>
                    </div>
                    <div className=' hidden lg:block w-6/12 h-screen bg-base-300'><AuthImagePattern title={"Join our community..!"}
                        subtitle={"Connect with friends, share momentes, and stay in touch with your love ones."}
                    /></div>
                </div>
            </div>
        </div>
    )
}

export default Signup