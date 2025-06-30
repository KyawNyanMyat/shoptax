import { useState } from "react";
import toast from "react-hot-toast";

const useSendWarning = () => {
  const [loading, setLoading] = useState(false);

  const sendWarning = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/warnings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "သတိပေးချက် ပေးပို့မှု မအောင်မြင်ပါ။");
      }

      const data = await res.json();
      toast.success("သတိပေးချက် ပေးပို့ပြီးပါပြီ။", { duration: 2000 });

    } catch (err) {
      console.error("သတိပေးချက် ပေးပို့ရာတွင် ပြဿနာရှိသည်:", err);
      toast.error(err.message, { duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return { sendWarning, loading };
};

export default useSendWarning;
