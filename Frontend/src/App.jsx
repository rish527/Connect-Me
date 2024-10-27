import { Route, Routes } from "react-router-dom"
import Layout from "./Components/Layout/Layout"

import HomePage from "./Pages/HomePage"
import SignUpPage from "./Pages/SignUpPage"
import LoginPage from "./Pages/LoginPage"
import { Toaster } from "react-hot-toast"

export default function App(){
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Toaster />
    </Layout>
  )
}