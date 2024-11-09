import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus } from 'lucide-react';
import Sidebar from '../Components/Sidebar'
import { Link } from 'react-router-dom';
import { formatDistance, formatDistanceToNow } from "date-fns";

function NotificationPage() {
    const {data:authUser}=useQuery({queryKey:["authUser"]});

    const queryClient=useQueryClient();

    const {data:notifications, isLoading}=useQuery({
        queryKey:["notifications"],
        queryFn:()=>axiosInstance.get("/notifications"),
    })

    const {mutate:markAsReadMutation}=useMutation({
        mutationFn:(id)=>axiosInstance.put(`/notifications/${id}/read`),
        onSuccess:()=>{
            queryClient.invalidateQueries(["notifications"]);
        }
    })

    const {mutate:deleteNotificationMutation}=useMutation({
        mutationFn:(id)=>axiosInstance.delete(`/notifications/${id}`),
        onSuccess:()=>{
            queryClient.invalidateQueries(["notifications"]);
            toast.success("Notification deleted");
        },
        onError:(err)=>{
            toast.error(err.message||"Error deleting notification");
        }
    })


    const renderNotificationIcon=(type)=>{
        switch(type){
            case "like":
                return <ThumbsUp className='text-blue-500'/>;
            
            case "comment":
                return <MessageSquare className='text-green-500' />;
            
            case "connectionAccepted":
                return <UserPlus className='text-purple-500'/>

            default:
                return null;

        }
    };

    const renderNotificationContent=(notification)=>{
        switch(notification.type){
            case "like":
                return(
                    <span>
                        <strong>{notification.relatedUser.username}</strong>liked your post
                    </span>
                )

            case "comment":
                return(
                    <span>
                        <Link to={`/profile/${notification.relatedUser.username}`} className='font-bold'>
                            {notification.relatedUser.name}
                        </Link>{" "}
                        commented on your post
                    </span>
                );
            
            case "connectionAccepted":
                return(
                    <span>
                        <Link to={`/profile/${notification.relatedUser.username}`}  className="font-bold">
                            {notification.relatedUser.name}
                        </Link>
                        {" "}accepted your connection request
                    </span>
                )

            default:
                null

        }
    }

    function renderRelatedPost(relatedPost){
        if(!relatedPost) return null;
        console.log("Post:",relatedPost)

        return(
            <Link to={`/post/${relatedPost._id}`}
            className='mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-color'>
                {relatedPost.img && (
                    <img src={relatedPost.img} alt='post preview' className='w-10 h-10 object-cover rounded' />
                )}
                <div className=''>
                    <p>{relatedPost.content}</p>
                </div>
                <ExternalLink size={14} className='text-gray-400' />
            </Link>
        )
    }

    // console.log(notifications);
    // console.log(notifications.createdAt);
    // console.log(new Date(notifications.createdAt));

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='col-span-1 lg:col-span-1'>
            <Sidebar user={authUser} />
        </div>
        <div className='col-span-1 lg:col-span-3'>
            <div className='bg-white rounded-lg shadow p-6'>
                <h1 className='text-2xl font-bold mb-6'>Notifications</h1>

                {isLoading ? (
                    <p>Loading notifications...</p>
                ) : notifications && notifications.data.length > 0 ? (
                    <ul>
                        {notifications.data.map((notification) => (
                            <li
                                key={notification._id}
                                className={`bg-white border rounded-lg p-4 my-4 transition-all hover:shadow-md ${
                                    !notification.read ? "border-blue-500" : "border-gray-200"
                                }`}
                            >
                                <div className='flex items-start justify-between'>
                                    <div className='flex items-center space-x-4'>
                                        <Link to={`/profile/${notification.relatedUser.username}`}>
                                            <img
                                                src={notification.relatedUser.profilePicture || "/avatar.png"}
                                                alt={notification.relatedUser.name}
                                                className='w-12 h-12 rounded-full object-cover'
                                            />
                                        </Link>

                                        <div>
                                            <div className='flex items-center gap-2'>
                                                <div className='p-1 bg-gray-100 rounded-full'>
                                                    {renderNotificationIcon(notification.type)}
                                                </div>
                                                <p className='text-sm'>{" "} {renderNotificationContent(notification)}</p>
                                            </div>
                                            <p className='text-xs text-gray-500 mt-1'>
                                                {formatDistanceToNow(new Date(notification.createdAt), {
                                                    addSuffix: true,
                                                })}
                                                {/* {formatDistance(new Date(notification.createdAt),new Date(),{addSuffix:true})} */}
                                            </p>
                                            {/* {console.log(notification)} */}
                                            {renderRelatedPost(notification.relatedPost)}
                                        </div>
                                    </div>

                                    <div className='flex gap-2'>
                                        {!notification.read && (
                                            <button
                                                onClick={() => markAsReadMutation(notification._id)}
                                                className='p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors'
                                                aria-label='Mark as read'
                                            >
                                                <Eye size={16} />
                                            </button>
                                        )}

                                        <button
                                            onClick={() => deleteNotificationMutation(notification._id)}
                                            className='p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors'
                                            aria-label='Delete notification'
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No notification at the moment.</p>
                )}
            </div>
        </div>
    </div>
);
}

export default NotificationPage
