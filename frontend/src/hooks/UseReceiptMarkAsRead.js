// hooks/UseReceiptMarkAsRead.js
import { useState } from "react";
import toast from "react-hot-toast";

const UseReceiptMarkAsRead = () => {
  const [loadingId, setLoadingId] = useState(true);

  const markAsRead = async (receiptId) => {
    setLoadingId(receiptId);
    try {
      const res = await fetch(`/api/receipts/mark-read/${receiptId}`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update");

      toast.success("Marked as read");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingId(false);
    }
  };

  return { loadingId, markAsRead };
};

export default UseReceiptMarkAsRead;
