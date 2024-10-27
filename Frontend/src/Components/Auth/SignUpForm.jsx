import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {axiosInstance} from "../../lib/axios.js"
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

function SignUpForm() {
    const [name, setName]=useState("");
    const [email, setEmail]=useState("");
    const [username, setUsername]=useState("");
    const [password, setPassword]=useState("");

    const {mutate:signUpMutation, isLoading}=useMutation({
        mutationFn: async (data) => {
            // console.log(data);
            const resp=await axiosInstance.post("/auth/signup",data)
            return resp.data;
        },
        onSuccess:()=>{
            toast.success("Account created Successfully")
        },
        onError:(error)=>{
            // console.log("Error spoted")
            toast.error(error.response.data.message|| "Something went wrong");
        }

    })

    const handleSignUp=(e)=>{
        e.preventDefault();
        signUpMutation({name,username,email, password});
        console.log(name,email,username,password);
    }

    return (
        <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
            <input type='text' placeholder='Full name' value={name} required
                onChange={(e)=>setName(e.target.value)} className='input input-bordered w-full'
            />
            <input type='text' placeholder='Username' value={username} required
                onChange={(e)=>setUsername(e.target.value)} className='input input-bordered w-full'
            />
            <input type='email' placeholder='Email' value={email} required
                onChange={(e)=>setEmail(e.target.value)} className='input input-bordered w-full'
            />
            <input type='password' placeholder='Password' value={password} required 
                onChange={(e)=>setPassword(e.target.value)} className='input input-bordered w-full'
            />

            <button disabled={isLoading} className='btn btn-primary w-full text-white'>
            {isLoading ? <Loader className='size-5 animate-spin'/>: "Sign Up"}
            </button>
        </form>
    )
}

export default SignUpForm
