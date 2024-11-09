import React from 'react'
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosInstance } from "../lib/axios"
import {useParams} from "react-router-dom"

import ProfileHeader from "../Components/ProfileHeader"
import AboutSection from "../Components/AboutSection"
import ExperienceSection from "../Components/ExperienceSection"
import EducationSection from "../Components/EducationSection"
import SkillSection from "../Components/SkillSection"
import toast from "react-hot-toast"

function ProfilePage() {
    const {username}=useParams();
    const queryClient=useQueryClient();

    const {data:authUser, isLoading}=useQuery({
        queryKey:["authUser"],
    })

    const {data:userProfile, isLoading:isUserProfileLoading}=useQuery({
        queryKey:["userProfile",username],
        queryFn:()=>axiosInstance.get(`/users/${username}`),
    })

    const {mutate:updateProfile}=useMutation({
        mutationFn:async (updatedData)=>{
            await axiosInstance.put(`/users/update`,updatedData)
        },
        onSuccess:()=>{
          toast.success("Profile updated successfully");
          queryClient.invalidateQueries(["userProfile",userProfile]);
        }

    })

    if(isLoading || isUserProfileLoading) return null;

    const isOwnProfile=authUser.username===userProfile.data.username;
    const userData=isOwnProfile?authUser:userProfile.data;

    const handleSave=(updatedData)=>{
        updateProfile(updatedData);
    }

  return (
    <div>
      <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
      <SkillSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} />
    </div>
  )
}

export default ProfilePage
