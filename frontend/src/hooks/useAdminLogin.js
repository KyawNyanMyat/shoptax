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
        throw new Error(data.message || "ဈေးတာ၀န်ခံ ဝင်ရောက်မှု မအောင်မြင်ပါ");
      }

      const now = new Date();
      const userWithExpiry = {
          value: data,
          expiry: now.getTime() + 1000 * 60 * 60 * 24,
      };

      localStorage.setItem("admin-dashboard", JSON.stringify(userWithExpiry))
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
