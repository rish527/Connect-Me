import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./Components/Layout/Layout"

import HomePage from "./Pages/HomePage"
import SignUpPage from "./Pages/SignUpPage"
import LoginPage from "./Pages/LoginPage"

import toast, { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "./lib/axios"
import NotificationPage from "./Pages/NotificationPage"

export default function App(){

  const {data:authUser, isLoading}=useQuery({
    queryKey: ["authUser"],
    queryFn: async()=>{
      try {
        const resp=await axiosInstance.get("/auth/user");
        return resp.data;
      } catch (error) {
        if(error.response && error.response.status===401){
          return null;
        }
        toast.error(error.response.data.message || "Something went wrong")
      }
    }
  })

  if (isLoading) return null;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={authUser?<HomePage />:<Navigate to={"/login"} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage />: <Navigate to={"/"} />} />
        <Route path="/login" element={!authUser ? <LoginPage />:<Navigate to={"/"} />} />
        <Route path="/notifications" element={authUser ? <NotificationPage />:<Navigate to={"/"} /> }/>
      </Routes>
      <Toaster />
    </Layout>
  )
}