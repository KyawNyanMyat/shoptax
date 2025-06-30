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
        throw new Error(data.message || "အုပ်ချုပ်ရေးဝင် ဝင်ရောက်မှု မအောင်မြင်ပါ");
      }

      localStorage.setItem("admin-dashboard", JSON.stringify(data))
      toast.success("ဝင်ရောက်မှု အောင်မြင်ပါသည်", {id: "admin-login"});
      navigate("/admin/dashboard");
    } catch (err) {
      console.log("Error in useAdminLogin", err.message)
      toast.error(err.message, { id: "admin-login-error",duration: 1500 });
    } finally {
      setLoading(false);
    }
  };

  return { adminLogin, loading };
};

export default useAdminLogin;
