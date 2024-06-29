import React, { useState } from 'react'
import { MdPassword } from 'react-icons/md'
import { FaEye, FaEyeSlash, FaUser } from 'react-icons/fa'
import XSvg from '../../../components/svgs/X'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const LoginPage = () => {
    const [ loginData,setLoginData ] = useState({
        username:"",
        password:""
    })

    const [showPassword, setShowPassword] = useState(true);

    const queryClient = useQueryClient()

    const { mutate:login,isError,isPending,error } = useMutation({
        mutationFn: async({username, password}) => {
            try {
                const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username, password })
				});

				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
            } catch (error) {
                console.log(error)
                throw error;
            }
        },
        onSuccess:() => {
            //refetch the authuser
            queryClient.invalidateQueries({queryKey:["authUser"]})
        },
        onError:() => {
            toast.error("Login Failed")
        }
    })

    const handleOnChange = (e) => {
        setLoginData({...loginData,[e.target.name]:e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        login(loginData);
    }

  return (
    <div className='max-w-screen-xl mx-auto flex h-screen'>
			<div className='flex-2 hidden lg:flex items-center justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<FaUser />
                        <input type="text" 
                               name="username" 
                               className="grow" 
                               placeholder='Username'
                               onChange={handleOnChange}
                               value={loginData.username} />
                    </label>

                    <label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
                        <input type={showPassword ? "password" : "text"}
                               name="password"
                               className="grow"
                               placeholder="Password"
                               onChange={handleOnChange}
                               value={loginData.password} />
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
                        { isPending ? "Loading...":"Login"}
                    </button>
					{isError && <p className='text-red-500'>Something went wrong</p>}
                </form>
                <div className='flex flex-col gap-2 mt-4'>
					<p className='text-white text-lg'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
					</Link>
				</div>
            </div>
    </div>
  )
}

export default LoginPage