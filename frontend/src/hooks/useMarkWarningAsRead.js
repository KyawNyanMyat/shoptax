// hooks/useMarkWarningAsRead.js
import { useState } from "react";
import toast from "react-hot-toast";

const useMarkWarningAsRead = () => {
  const [loadingId, setLoading] = useState(false);

  const markAsRead = async (warningId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/warnings/user/${warningId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");

    } 
    catch (error) {
        console.log("Error in useMarkWarningAsRead", error.message)
    } finally {
      setLoading(false);
    }
  };

  return { markAsRead, loadingId };
};

export default useMarkWarningAsRead;
