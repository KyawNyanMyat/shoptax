import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useAdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const adminLogin = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admins/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Admin login failed");
      }

      toast.success("Admin login successful");
      navigate("/admin/dashboard"); // adjust route as needed
    } catch (err) {
      toast.error(err.message, {duration:1500});
      console.log("Error in useAdminLogin", err.message)
    } finally {
      setLoading(false);
    }
  };

  return { adminLogin, loading };
};

export default useAdminLogin;
