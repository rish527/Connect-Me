import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../lib/axios'
import Sidebar from '../Components/Sidebar'
import PostCreation from '../Components/PostCreation'
import Post from '../Components/Post'
import { User } from 'lucide-react'
import RecommendedUser from '../Components/RecommendedUser'

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

        {posts?.map(post=> <Post key={post._id} post={post} />)}

        {/* posts?.length==0 */}
        {posts?.length==0  && (
          <div className='bg-white rounded-lg shadow p-8 text-center'>
              <div className="mb-6">
                <User size={64} className='mx-auto text-blue-500' />
              </div>
              <h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts Yet</h2>
              <p className='text-gray-600 mb-6'>Connect with others to start seeing posts in your feed!</p>
          </div>
        )}

      </div>

      {recomendedUsers?.length>0 && (
        <div className="col-span-1 lg:col-span-1 hidden lg:block">
          <div className="bg-secondary rounded-lg shadow p-4">
            <h2 className='font-semibold mb-4'>People you may know</h2>
            {recomendedUsers?.map((user)=>(
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>
        </div>
      )}
      
    </div>
  )
}

export default HomePage
