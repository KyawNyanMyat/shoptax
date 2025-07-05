import { useState } from "react";
import { toast } from "react-hot-toast";

export const useRemoveUserFromShop = (refetchShops) => {
    const [loading, setLoading] = useState(false)
    const removeUserFromShop = async (shopId) => {
        setLoading(true)
        try {
        const res = await fetch(`/api/shops/${shopId}/remove-user`, {
            method: "PATCH",
            credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        toast.success("အသုံးပြုသူကို ဆိုင်မှ ဖယ်ရှားပြီးပါပြီ။");
        } catch (err) {
            console.log("Error in useRemoveUserFromShop Hook", err)
            toast.error(err.message || "ဖယ်ရှားမှု မအောင်မြင်ပါ။");
        }
        finally{
            setLoading(false)
        }
    };

  return { removeUserFromShop, loading };
};
