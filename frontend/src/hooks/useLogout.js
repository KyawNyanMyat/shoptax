import { useUserAuthContext } from "../context/userAuthContext"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const useLogout = (changepassword=false) => {
  const { setUserAuth } = useUserAuthContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true)
    try {

      const res = await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include", // Send cookies
      });

      const data = await res.json();

      if(!res.ok){
        throw new Error(data.message || "တခုခုမှားယွင်းနေပါသည်");
      }

      // Clear frontend data
      localStorage.removeItem("user-dashboard");
      setUserAuth(null);
      changepassword === false ? toast.success(data.message, {id: "logout-error", duration: 2500}) : null
      navigate("/");

    } catch (error) {
      console.error("Logout Error:", error.message);
      toast.error(error.message, {id: "logout-error", duration: 2500})
    }finally {
        setLoading(false);
    }
  };

  return { loading, logout };
};

export default useLogout;
