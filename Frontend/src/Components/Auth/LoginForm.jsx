import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { axiosInstance } from '../../lib/axios';
import toast from 'react-hot-toast';

function LoginForm() {
  const [username, setUsername]=useState("");
  const [password, setPassword]=useState("");

  const queryClient=useQueryClient();

  const {mutate:loginMutation, isLoading}=useMutation({
    mutationFn: async (userData) => axiosInstance.post("/auth/login",userData),
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:["authUser"]});
    },
    onError:(error)=>{
      toast.error(error.response.data.message|| "Something went wrong");
    },
  })

  const handleSubmit=(e)=>{
    e.preventDefault();
    // console.log("Loged in ", username, password)
    loginMutation({username,password})
  }

  return (
      <form onSubmit={handleSubmit} className='space-y-4 max-w-md flex flex-col items-center'>
        <input type='text' placeholder='Username' value={username} 
          onChange={(e)=>setUsername(e.target.value)} className='input input-bordered w-full' required
        />
        <input type='password' placeholder='Password' value={[password]} 
          onChange={(e)=>setPassword(e.target.value)} className='input input-bordered w-full' required
        />
        <button type='submit' className='btn btn-primary w-full'>
          LogIn
        </button>
      </form>

  )
}

export default LoginForm
