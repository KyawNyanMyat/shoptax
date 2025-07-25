import { useState } from "react";
import toast from "react-hot-toast";

const usePaymentStatusUpdate = () => {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (paymentId, newStatus, userId, rejectionReason) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payments/changestatus/${paymentId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus, userId ,rejectionReason})
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Update လုပ်တာမအောင်မြင်ပါ");

      if(newStatus === "Finished"){
        toast.success(`ငွေပေးချေမှုကို အောင်မြင်စွာ လက်ခံပြီးပါပြီ။`);
      }

      if(newStatus === "Rejected"){
        toast.success(`ငွေပေးချေမှုကို ငြင်းဆန်လိုက်ပါပြီ။`);
      }
      
    } catch (err) {
      toast.error(err.message || "တခုခုမှားနေပါသည်", {id:"payment-status-error"});
      console.log("Error in usePaymentStatusUpdate", err.message)
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading };
};

export default usePaymentStatusUpdate;
