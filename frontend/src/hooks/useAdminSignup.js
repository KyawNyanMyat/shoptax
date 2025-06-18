import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const useAdminSignup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const adminSignup = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admins/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to register");
      }

      toast.success("Admin registered successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
        console.log("Error in useAdminSignup hook", err.message)
        toast.error(err.message, {duration: 1500});
    } finally {
      setLoading(false);
    }
  };

  return { adminSignup, loading };
};

export default useAdminSignup;
