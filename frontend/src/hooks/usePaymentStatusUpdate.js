import { useState } from "react";
import toast from "react-hot-toast";

const usePaymentStatusUpdate = () => {
  const [loading, setLoading] = useState(false);

  const updateStatus = async (paymentId, newStatus, userId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payments/changestatus/${paymentId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus, userId })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update status");

      toast.success(`Payment ${newStatus} successfully`);
      
    } catch (err) {
      toast.error(err.message || "Something went wrong");
      console.log("Error in usePaymentStatusUpdate", err.message)
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading };
};

export default usePaymentStatusUpdate;
