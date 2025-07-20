import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const adminAuthContext = createContext()

export const useAdminAuthContext = ()=>{
    return useContext(adminAuthContext)
}

export const AdminAuthContextProvider = ({children})=>{
    const navigate = useNavigate()
    const getUserFromStorage = () => {
        const itemStr = localStorage.getItem("admin-dashboard");
        if (!itemStr) return null;
      
        try {
          const item = JSON.parse(itemStr);
          const now = new Date().getTime();
      
          if (now > item.expiry) {
            localStorage.removeItem("admin-dashboard");
            return null;
          }
      
          return item.value;
        } catch {
          return null;
        }
    };
    const [ adminAuth, setAdminAuth ] = useState(getUserFromStorage())
      
    useEffect(() => {
        const checkExpiry = () => {
          const itemStr = localStorage.getItem("admin-dashboard");
          if (!itemStr) return;
      
          const item = JSON.parse(itemStr);
          const now = new Date().getTime();
      
          if (now > item.expiry) {
            localStorage.removeItem("admin-dashboard");
            setAdminAuth(null);
            toast.error("အကောင့်သက်တမ်းကုန်သွားပါပြီ",{id:"expire"});
            navigate("/admin");
          }
        };
      
        const interval = setInterval(checkExpiry, 1000 * 5);
        return () => clearInterval(interval);
    }, [navigate]);
      
      
    return <adminAuthContext.Provider value={ {adminAuth, setAdminAuth} }>{children}</adminAuthContext.Provider>
}