import React, { useEffect, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardSidebar from "../../components/DashboardSidebar";
import toast from "react-hot-toast";
import useSubmitPayment from "../../hooks/useSubmitPayment";
import { useUserAuthContext } from "../../context/userAuthContext";
import { Navigate } from "react-router-dom";

const SubmitPaymentProof = () => {
  const { userAuth } = useUserAuthContext()
  if(!userAuth){
    return <Navigate to={"/"} />
  }
  const userId = userAuth._id;
  const [userName, setUserName] = useState("");
  const [marketHallNo, setMarketHallNo] = useState("");
  const [shopNo, setShopNo] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [paymentPhoto, setPaymentPhoto] = useState("");
  const [amount, setAmount] = useState("");
  const [shopId, setShopId] = useState("");
  const [ownedShops, setOwnedShops] = useState([]);

  const { loading, submitPayment } = useSubmitPayment()

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "တခုခုမှားယွင်းနေပါသည်");

        const shopRes = await fetch(`/api/shops/user/${userId}`);
        const shopData = await shopRes.json()

        if (!shopRes.ok) throw new Error(shopData.message || "တခုခုမှားယွင်းနေပါသည်");

        setUserName(data.username)
        setOwnedShops(shopData);

        // setShopId(shopData._id)
        // setMarketHallNo(shopData.marketHallNo)
        // setShopNo(shopData.shopNo)
        
      } catch (error) {
        console.log("Error in Receipt.jsx", error.message);
        toast.error(error.message, {id:"payment-error", duration: 2500})
      }
    };

    getUserInfo();
  }, []);

  // For select option only
  const handleShopChange = (e) => {
    const selectedShopId = e.target.value;
    setShopId(selectedShopId);
  
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();

    //Handleing ISO Date
    const currentDateISO = new Date().toISOString(); // e.g., "2025-12-10T05:00:00.000Z"

    const currentDate = new Date(currentDateISO);
    const currentMonth = currentDate.getUTCMonth(); // 0 = Jan, 11 = Dec
    const currentYear = currentDate.getUTCFullYear();

    const nextMonthDate = new Date(currentDate)

    if (currentMonth == 11) {
      nextMonthDate.setUTCDate(10)
      nextMonthDate.setUTCMonth(0); 
      nextMonthDate.setUTCFullYear(currentYear + 1); 
    } else {
      nextMonthDate.setUTCDate(10)
      nextMonthDate.setUTCMonth(currentMonth + 1);
    }

    const nextPaymentDueDateISO = nextMonthDate.toISOString();
    

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("shopId", shopId);
    formData.append("paymentType", paymentType);
    formData.append("amount", amount);
    formData.append("paymentPhoto", paymentPhoto);
    formData.append("nextPaymentDueDate", nextPaymentDueDateISO)


    // Submit to database
    await submitPayment(formData)
  };


  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
  
        <div className="p-6 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">ငွေပေးချေမှုအထောက်အထား တင်သွင်းရန်</h2>
          <p className="text-sm text-gray-600 mb-6">
            ငွေပေးချေမှု၏ Screenshot (ဥပမာ - KBZPay၊ WavePay) တင်ပါ။ သက်ဆိုင်ရာ ကျသင့်ငွေ အမျိုးအစားနှင့် ငွေပမာဏ ထည့်ရန်လိုအပ်သည်။
          </p>
  
          <form onSubmit={handleSubmit} className="space-y-4">
  
            <div>
              <label className="label">အသုံးပြုသူအမည်</label>
              <input
                type="text"
                value={userName}
                disabled
                className="input input-bordered w-full bg-gray-100 focus:outline-offset-0"
              />
            </div>
  
            <div>
              <label className="label">ဆိုင် ရွေးချယ်ရန်</label>
              <select
                className="select select-bordered w-full focus:outline-offset-0"
                value={shopId}
                onChange={handleShopChange}
                disabled={ownedShops.length == 0}
                required
              >
                <option value="" disabled>
                  {ownedShops.length == 0 ? "ဆိုင်မရှိပါ" : "သင်၏ ဆိုင် ရွေးပါ"}
                </option>
                {ownedShops.map((shop) => (
                <option key={shop._id} value={shop._id}>
                  ({shop.marketHallNo}-{shop.shopNo}): {shop.chargeRate || "မသတ်မှတ်ရသေးပါ"} MMK
                </option>
                ))}
              </select>
            </div>
  
            <div>
              <label className="label">ငွေပေးချေမှုအမျိုးအစား</label>
              <select
                className="select select-bordered w-full focus:outline-offset-0"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                required
              >
                <option value="" disabled>ငွေ ပေးချေမှု အမျိုးအစား ရွေးပါ</option>
                <option value="NRC Register Cost">မှတ်ပုံတင် အခကြေးငွေ</option>
                <option value="Land Rent Cost">မြေနှုန်းထား အခကြေးငွေ</option>
                <option value="Overdue Fee">အကြွေးကျန် ငွေ</option>
              </select>
            </div>
  
            {/* In the future change into Myanmar Value */}
            <div>
              <label className="label">Screenshot တင်ပါ (ဥပမာ - KBZPay screenshot)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentPhoto(e.target.files[0])}
                className="file-input file-input-bordered w-full focus:outline-offset-0"
                required
              />
            </div>
  
            <div>
              <label className="label">ငွေပမာဏအတည်ပြုပါ</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[၀-၉]+"
                placeholder="ဥပမာ - ၁၀၀၀၀"
                value={amount}
                onChange={(e) => {
                  const myanmarNumberRegex = /^[၀-၉]*$/;
                  if (myanmarNumberRegex.test(e.target.value)) {
                    setAmount(e.target.value);
                  }
                }}
                className="input input-bordered w-full focus:outline-offset-0"
                required
              />
            </div>
  
            <button type="submit" className="btn btn-primary w-full">
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "ငွေပေးချေမှု တင်သွင်းရန်"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  
};

export default SubmitPaymentProof;