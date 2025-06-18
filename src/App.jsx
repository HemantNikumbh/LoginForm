import {Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import EmailVerify from "./pages/EmailVerify"
import ResetPassword from "./pages/ResetPassword"
import Navbar from "./components/Navbar"
import {ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

const App = () =>{
  return(
    <>
    <ToastContainer/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/Login" element={<Login/>}/>
      <Route path="/email-verify" element={<EmailVerify/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
     
    </Routes>
    </>
  )
}

export default App