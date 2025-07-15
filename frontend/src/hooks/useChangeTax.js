import { useState } from "react";
import toast from "react-hot-toast";

const useChangeTax = () => {
  const [taxLoading, setTaxLoading] = useState(false);

  const changeShopTax = async (shopId,taxValue) => {
    setTaxLoading(true);
    try {
      const res = await fetch(`/api/shops/changeTax/${shopId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({chargeRate: taxValue}),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "အခွန်ပြောင်းလဲချင်း မအောင်မြင်ပါ");
      }

      toast.success("အခွန်ပြောင်းလဲချင်း အောင်မြင်ပါသည်!", {id:"taxError"});
      return true
    } catch (err) {
        console.log("useChangeTax မှာ error ဖြစ်နေတယ်", err.message)
        toast.error(err.message, { duration: 2500, id:"taxError" });
        return false
    } finally {
      setTaxLoading(false);
    }
  };

  return { changeShopTax, taxLoading };
};

export default useChangeTax;
