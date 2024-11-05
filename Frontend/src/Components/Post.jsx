import React, { useState } from 'react'
import { axiosInstance } from '../lib/axios';
import { useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { Loader,  MessageCircle, Send, Share2, ThumbsUp, Trash2 } from 'lucide-react';
import PostAction from './PostAction';
import {formatDistance, formatDistanceToNow, subDays} from 'date-fns'


function Post({post}) {
    const postId=useParams();

    const {data:authUser}=useQuery({queryKey:["authUser"]});
    const queryClient=useQueryClient();

    const [showComments,setShowComments]=useState(false);
    const [newComment, setNewComment]=useState('');
    const [comments, setComments]=useState(post.comments||[]);
    const isOwner=authUser._id===post.auther._id;
    const isLiked=post.likes.includes(authUser._id);

    const {mutate:deletePost, isPending:isDeletingPost}=useMutation({
        mutationFn:async ()=>{
            console.log("Deleting")
            await axiosInstance.delete(`/posts/delete/${post._id}`);
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["posts"]})
            toast.success("Post Deleted successfully");
        },
        onError:(error)=>{
            toast.error(error.message);
        }
    })

    const {mutate:createComment, isPending:isAddingComment}=useMutation({
        mutationFn:async (newComment)=>{
            await axiosInstance.post(`/posts/${post._id}/comment`,{content:newComment});
        },
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["posts"]});
            toast.success("Comment added successfully");
        },
        onError:(error)=>{
            toast.error(error.response.data.message || "Failed to add comment");
        }
    })

    const { mutate: likePost, isPending: isLikingPost } = useMutation({
		mutationFn: async () => {
			await axiosInstance.post(`/posts/${post._id}/like`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["post", postId] });
		},
	});

    const handleDeletePost=()=>{
        if(!window.confirm("Do you want to delete this Post:?")) return;
        deletePost();
    }

    const handleLikePost = async () => {
		if (isLikingPost) return;
		likePost();
        // console.log(post.likes.length)
	};

    const handleAddComment=async (e)=>{
        // console.log(e.target.value);
        e.preventDefault();
        if(newComment.trim()){
            createComment(newComment);
            setNewComment("");
            setComments([...comments,{
                content:newComment,
                auther:{
                    _id:authUser._id,
                    name:authUser.name,
                    profilePicture:authUser.profilePicture,
                },
                createdAt:new Date(),
            }])
        }
        console.log("Success");
    }

    // console.log(post.comments[0]);
  return (
    <div className='bg-secondary rounded-lg shadow mb-4'>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
                <Link to={`/profile/${post?.auther.username}`}>
                    <img 
                        src={post.auther.profilePicture || "/avatar.png"}
                        alt={post.auther.name}
                        className='size-10 rounded-full mr-3'
                    />
                </Link>
                <div>
                    <Link to={`/profile/${post?.auther.username}`}>
                        <h3 className='font-semibold'>{post.auther.name}</h3>
                    </Link>
                    <p className='text-xs text-info'>{post.auther.headline}</p>
                    <p className='text-xs text-info'>
                        {formatDistance(new Date(post.createdAt),new Date(),{addSuffix:true})}
                    </p>

                </div>

            </div>
            {isOwner && (
                <button onClick={handleDeletePost} className='text-red-500 hover:text-red-700' >
                    {isDeletingPost?<Loader size={18} className='animate-spin' />:<Trash2 size={18} />}
                </button>
            )}
        </div>
        <p className='mb-4'>{post.content}</p>
        {post.img && <img src={post.img} alt="Post  content" className='rounded-lg w-full mb-4' />}

        <div className="flex justify-between text-info">
            <PostAction
                icon={<ThumbsUp size={18} className={isLiked ? "text-blue-500  fill-blue-300" : ""} />}
                text={`Like (${post.likes.length})`}
                onClick={handleLikePost}
            />
            <PostAction
                icon={<MessageCircle size={18} />}
                text={`Comment(${post.comments.length})`}
                onClick={()=>setShowComments(!showComments)}
            />
            <PostAction 
                icon={<Share2 size={18} />}
                text="Share"
            />
        </div>
      </div>
        
        
      {showComments && (
        
        <div className="px-4 pb-4">
            <form onSubmit={handleAddComment} className='flex items-center'>
                <input
                    type='text'
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className='flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary'
                />
                <button type='submit' className='bg-primary text-white p-2.5 rounded-r-full hover:bg-primary-dark transition duration-300 h-full' disabled={isAddingComment}>
                    {isAddingComment? <Loader size={18} className='animate-spin' />:<Send size={18} />}
                </button>
            </form>

            <div className="max-h-60 overflow-y-auto mt-4">
                {comments.map((comment)=>(
                    <div key={comment._id} className='mb-2 bg-base-100 p-2 rounded flex items-start'>
                        <img src={comment.auther.profilePicture||"avatar.png"} 
                        alt={comment.auther.name}
                        className='w-8 h-8 rounded-full mr-2 flex-shrink-0'
                        />
                        <div className="flex-grow">
                            <div className="flex items-center mb-1">
                                <span className="font-semibold mr-2">{comment.auther.name}</span>
                                <span className='text-xs text-info'>{formatDistanceToNow(new Date(comment.createdAt))}</span>
                            </div>
                            <p>{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default Post
