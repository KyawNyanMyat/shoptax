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
        throw new Error(data.message || "အကောင့်ဖွင့်ခြင်း မအောင်မြင်ပါ");
      }

      toast.success("အက်မင်အကောင့်အောင်မြင်စွာဖွင့်ပြီးပါပြီ!");
      return true
      //navigate("/admin/dashboard"); // အနာဂတ်တွင်ပြန်ဖွင့်ပါ
    } catch (err) {
        console.log("useAdminSignup မှာ error ဖြစ်နေတယ်", err.message)
        toast.error(err.message, { duration: 2500 });
        return false
    } finally {
      setLoading(false);
    }
  };

  return { adminSignup, loading };
};

export default useAdminSignup;
