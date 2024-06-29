import React, { useState } from 'react'
import { MdDriveFileRenameOutline, MdOutlineMail, MdPassword } from 'react-icons/md'
import { FaUser, FaEye, FaEyeSlash } from 'react-icons/fa'
import XSvg from '../../../components/svgs/X'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const SignUpPage = () => {
    const [ userData, setUserData ] = useState({
            email: "",
            username:"",
            fullname:"",
            password:""
        });

    const [ showPassword, setShowPassword ] = useState(true);

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: async ({ email, username, fullname, password }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullname, password })
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to create account");
				console.log(data);
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");
		},
    });

    const handleOnChange = (e) => {
        setUserData({...userData,[e.target.name]:e.target.value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        mutate(userData);
    }
    
  return (
    <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
        <div className='flex-1 hidden lg:flex items-center justify-center'>
            <XSvg className=' lg:w-2/3 fill-white' />
        </div>
        <div className='flex-1 flex flex-col justify-center items-center'>
            <form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
                <XSvg className='w-24 lg:hidden fill-white' />
                <h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
                <label className='input input-bordered rounded flex items-center gap-2'>
                    <MdOutlineMail />
                    <input type='email'
                            className='grow'
                            name='email'
                            placeholder='Email'
                            onChange={handleOnChange}
                            value={userData.email} />
                </label>
                <div className='flex gap-4 flex-wrap'>
                    <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                        <FaUser />
                        <input type="text" 
                                className="grow" 
                                name="username" 
                                placeholder="Username"
                                onChange={handleOnChange}
                                value={userData.username} />
                    </label>
                    <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                        <MdDriveFileRenameOutline />
                        <input type="text" 
                                name="fullname" 
                                className="grow"
                                placeholder='Fullname'
                                onChange={handleOnChange}
                                value={userData.fullname}/>
                    </label>
                </div>
                <label className='input input-bordered rounded flex items-center gap-2'>
                    <MdPassword />
                    <input type= {showPassword ? "password" : "text"} 
                            name="password" 
                            className="grow"
                            placeholder='Password'
                            onChange={handleOnChange}
                            value={userData.password} />
                    <div className='cursor-pointer p-1 text-lg' onClick={()=> setShowPassword(preve=>!preve)}>
                        <span>
                            {
                                showPassword ? (
                                    <FaEyeSlash/>
                                ):
                                (
                                    <FaEye/>
                                )
                            }
                        </span>
                    </div>
                </label>
                <button className='btn rounded-full btn-primary text-white'>
                    { isPending ? "Loading...":"Sign Up"}
                </button>
                {isError && <p className='text-red-500'>{error.message}</p>}
            </form>
        </div>
    </div>
  )             
}

export default SignUpPage;