import { useState } from "react";
import toast from "react-hot-toast";


const useCreateShop = () => {
  const [loading, setShopLoading] = useState(false);

  const createShop = async (formData) => {
    setShopLoading(true);
    try {
      const res = await fetch("/api/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "ဆိုင်ဖန်တီးမှု မအောင်မြင်ပါ။");
      }

      toast.success("ဆိုင်အသစ် ဖန်တီးပြီးပါပြီ။", { duration: 2000 });
      return true;
    } catch (err) {
      toast.error(err.message || "မအောင်မြင်ပါ။", { id:"shopcreate",duration: 2000 });
      return false;
    } finally {
      setShopLoading(false);
    }
  };

  return { createShop, loading };
};

export default useCreateShop;
