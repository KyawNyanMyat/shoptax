import { Children, createContext, useContext, useState } from "react";

const adminAuthContext = createContext()

export const useAdminAuthContext = ()=>{
    return useContext(adminAuthContext)
}

export const AdminAuthContextProvider = ({children})=>{
    const [ adminAuth, setAdminAuth ] = useState( JSON.parse(localStorage.getItem("admin-dashboard")) || null)

    return <adminAuthContext.Provider value={ {adminAuth, setAdminAuth} }>{children}</adminAuthContext.Provider>
}