import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAdminAuthContext } from "../context/adminAuthContext";

const useAdminLogout = () => {
  const { setAdminAuth } = useAdminAuthContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    setLoading(true)
    try {

      const res = await fetch("/api/admins/logout", {
        method: "POST",
        credentials: "include", // Send cookies
      });

      const data = await res.json();

      if(!res.ok){
        throw new Error(data.message || "တခုခုမှားယွင်းနေပါသည်");
      }

      localStorage.removeItem("admin-dashboard");
      setAdminAuth(null);
      toast.success(data.message, {id: "admin-logout-error", duration: 2500})
      navigate("/admin");

    } catch (error) {
      console.error("Logout Error:", error.message);
      toast.error(error.message, {id: "admin-logout-error", duration: 2500})
    }finally {
        setLoading(false);
    }
  };

  return { loading, logout };
};

export default useAdminLogout;
