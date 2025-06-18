import axios from "axios"
import { createContext, useEffect, useState } from "react"
import { toast } from 'react-toastify'

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    axios.defaults.withCredentials = true

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggein, setIsLoggein] = useState(false)
    const [userData, setUserData] = useState(null)

    const getAuthState = async()=>{
        try{
            const{data} = await axios.post(backendUrl+"/api/auth/is-auth")
            if(data.success){
                setIsLoggein(true)
                getUserData()
            }
        }catch(err){
            console.log(err)
        }

    }

    const getUserData = async ()=>{
        try{
            const{data} = await axios.post(backendUrl+"/api/user/data")
            data.success ? setUserData(data.userData) : toast.error(data.message)
        }catch(error){
            toast.error(data.message)
        }
    }

    useEffect(()=>{
        getAuthState()
    },[])

    const value = {
        backendUrl,
        isLoggein,
        setIsLoggein,
        userData,
        setUserData,
        getUserData,
        getAuthState
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}