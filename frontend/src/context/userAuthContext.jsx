import { createContext, useContext, useState } from "react"

const userAuthContext = createContext();

export const useUserAuthContext= ()=>{
    return useContext(userAuthContext)
}

export const UserAuthContextProvider = ({children})=>{

    const [userAuth, setUserAuth] = useState(JSON.parse(localStorage.getItem("user-dashboard")) || null)

    return <userAuthContext.Provider value={{userAuth, setUserAuth}}>{children}</userAuthContext.Provider>
}