import { createContext, useContext, useEffect, useState } from "react"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const userAuthContext = createContext();

export const useUserAuthContext= ()=>{
    return useContext(userAuthContext)
}

export const UserAuthContextProvider = ({children})=>{

    const navigate = useNavigate()
    const getUserFromStorage = () => {
        const itemStr = localStorage.getItem("user-dashboard");
        if (!itemStr) return null;
      
        try {
          const item = JSON.parse(itemStr);
          const now = new Date().getTime();
      
          if (now > item.expiry) {
            localStorage.removeItem("user-dashboard");
            return null;
          }
      
          return item.value;
        } catch {
          return null;
        }
      };
      
      const [userAuth, setUserAuth] = useState(getUserFromStorage());
      
      useEffect(() => {
        const checkExpiry = () => {
          const itemStr = localStorage.getItem("user-dashboard");
          if (!itemStr) return;
      
          const item = JSON.parse(itemStr);
          const now = new Date().getTime();
      
          if (now > item.expiry) {
            localStorage.removeItem("user-dashboard");
            setUserAuth(null);
            toast.error("အကောင့်သက်တမ်းကုန်သွားပါပြီ");
            navigate("/");
          }
        };
      
        const interval = setInterval(checkExpiry, 1000 * 5);
        return () => clearInterval(interval);
      }, [navigate]);
      
      

    return <userAuthContext.Provider value={{userAuth, setUserAuth}}>{children}</userAuthContext.Provider>
}