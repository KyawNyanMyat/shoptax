import React, { useEffect, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardSidebar from "../../components/DashboardSidebar";
import toast from "react-hot-toast";
import useSubmitPayment from "../../hooks/useSubmitPayment";
import { useUserAuthContext } from "../../context/userAuthContext";
import { Navigate } from "react-router-dom";
import { useSocketContext } from "../../context/socketContext";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { loading, submitPayment } = useSubmitPayment()
  const socket = useSocketContext()

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

  useEffect(()=>{
    if(!socket) return;

    const handleShopAssigned = (updatedShop)=>{
      setOwnedShops(prevShops => [...prevShops, updatedShop])
    }

    const handleShopRemoved = (shop)=>{
      setOwnedShops(prevShops => {
        return prevShops.filter((s)=> s._id != shop._id)
      })
    }

    const handleShopTaxChangedForBoth = (updatedShop) => {
      setOwnedShops(prev => {
          const index = prev.findIndex(s => s._id === updatedShop._id);
          if (index !== -1) {
              const copy = [...prev];
              copy[index].chargeRate = updatedShop.chargeRate;
              return copy;
          }
          return prev;
      });
    };

    socket.on("shopTaxChanged", handleShopTaxChangedForBoth);
    socket.on("shopAssigned", handleShopAssigned)
    socket.on("shopRemoved", handleShopRemoved)

    return ()=>{
      socket.off("shopAssigned", handleShopAssigned)
      socket.off("shopRemoved", handleShopRemoved)
      socket.off("shopTaxChanged", handleShopTaxChangedForBoth);
    }
  },[socket])

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
    const success = await submitPayment(formData)
    if(success){
      setShopId("");
      setPaymentType("");
      setPaymentPhoto("");
      setAmount("");

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    }
  };


  return (
    <div className="flex max-h-screen">
      <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
      <div className="flex-1 flex flex-col">
        <DashboardHeader setSidebarOpen={setSidebarOpen}/>
  
        <div className="p-6 w-full max-w-2xl mx-auto h-screen overflow-y-scroll">
          <h2 className="text-2xl font-bold mb-2">ငွေပေးချေမှုအထောက်အထား တင်သွင်းရန်</h2>
          <p className="text-sm text-gray-600 mb-6">
            ငွေပေးချေမှု၏ Screenshot (ဥပမာ - KBZPay၊ WavePay) တင်ပါ။ သက်ဆိုင်ရာ ကျသင့်ငွေ အမျိုးအစားနှင့် ငွေပမာဏ ထည့်ရန်လိုအပ်သည်။
          </p>
  
          <form onSubmit={handleSubmit} className="space-y-4 min-w-[200px] sm:w-full">
  
            <div className="flex flex-col">
              <label className="label">အသုံးပြုသူအမည်</label>
              <input
                type="text"
                value={userName}
                disabled
                className="input input-bordered w-full bg-gray-100 focus:outline-offset-0"
              />
            </div>
  
            <div className="flex flex-col">
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
  
            <div className="flex flex-col">
              <label className="label">ငွေပေးချေမှုအမျိုးအစား</label>
              <select
                className="select select-bordered w-full focus:outline-offset-0"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                required
              >
                <option value="" disabled>ငွေ ပေးချေမှု အမျိုးအစား ရွေးပါ</option>
                {/* <option value="NRC Register Cost">မှတ်ပုံတင် အခကြေးငွေ</option> */}
                <option value="Shop Rent Cost">ဆိုင်ဌားခ အခကြေးငွေ</option>
                <option value="Overdue Fee">အကြွေးကျန် ငွေ</option>
              </select>
            </div>
  
            <div className="mb-0 flex flex-col">
              <label className="label w-full whitespace-pre-wrap">
                Screenshot တင်ပါ (ဥပမာ - KBZPay screenshot)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const maxSize = 2 * 1024 * 1024; // 2MB

                  if (file && file.size > maxSize) {
                    toast.error("ဓာတ်ပုံအရွယ်အစားသည် 2MB ထက်မကြီးရပါ။ ကျေးဇူးပြု၍ သေးငယ်သောဖိုင်တင်ပါ။", {id:"imageError", duration: 4000});
                    e.target.value = ""; // reset file input
                    return;
                  }

                  setPaymentPhoto(file);
                }}
                className="file-input file-input-bordered w-full focus:outline-offset-0"
                required
              />
            </div>
            <div className="text-red-500 text-sm">(ဓာတ်ပုံသည် 2MB ထက်မကျော်ရပါ)</div>

            <div className="flex flex-col">
              <label className="label">ငွေပမာဏအတည်ပြုပါ</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="ဥပမာ - 3500"
                value={amount}
                onChange={(e) => {
                  // const myanmarNumberRegex = /^[၀-၉]*$/;
                  // if (myanmarNumberRegex.test(e.target.value)) {
                  //   setAmount(e.target.value);
                  // }

                  //English
                  const value = e.target.value;
                  const pattern = /^(0|[1-9][0-9]*)?$/; // Allows empty string or positive numbers without leading zero
                  if (pattern.test(value)) {
                    setAmount(value);
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