import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../lib/axios'
import Sidebar from '../Components/Sidebar'
import PostCreation from '../Components/PostCreation'

const HomePage = () => {
  const {data:authUser}=useQuery({queryKey:['authUser']})

  const {data:recomendedUsers,}=useQuery({
    queryKey: ['recomendedUsers'],
    queryFn: async()=>{
      const resp=await axiosInstance.get("/users/suggestions");
      return resp.data;
    }
  })

  const {data:posts}=useQuery({
    queryKey: ['posts'],
    queryFn: async()=>{
      const resp=await axiosInstance.get("/posts");
      return resp.data;
    }
  })

  console.log("Auth user:",authUser);
  console.log("Posts:",posts);
  console.log("Suggestions:",recomendedUsers);

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='hidden lg:block lg:col-span-1'>
        <Sidebar user={authUser} />
      </div>

      <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
        <PostCreation user={authUser} />

        {posts?.map(post=> <Post key={post._id} post={post} />)};
      </div>
    </div>
  )
}

export default HomePage
