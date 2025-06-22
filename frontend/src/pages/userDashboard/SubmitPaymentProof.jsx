import React, { useEffect, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardSidebar from "../../components/DashboardSidebar";
import toast from "react-hot-toast";
import useSubmitPayment from "../../hooks/useSubmitPayment";

const SubmitPaymentProof = () => {

  const userId = "68543412639f9a63f9dd50b3"; // in the future
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

        if (!res.ok) throw new Error(data.message || "Something went wrong");

        const shopRes = await fetch(`/api/shops/user/${userId}`);
        const shopData = await shopRes.json()

        if (!shopRes.ok) throw new Error(data.message || "Something went wrong");

        setUserName(data.username)
        setOwnedShops(shopData);

        // setShopId(shopData._id)
        // setMarketHallNo(shopData.marketHallNo)
        // setShopNo(shopData.shopNo)
        
      } catch (error) {
        console.log("Error in Receipt.jsx", error.message);
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
          <h2 className="text-2xl font-bold mb-2">Submit Payment Proof</h2>
          <p className="text-sm text-gray-600 mb-6">
            Upload a screenshot of your payment (e.g., KBZPay, WavePay). Please ensure to select Cost Type and enter amount.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="label">Username</label>
              <input
                type="text"
                value={userName}
                disabled
                className="input input-bordered w-full bg-gray-100 focus:outline-offset-0"
              />
            </div>

            <div>
              <label className="label">Select Shop</label>
              <select
                className="select select-bordered w-full focus:outline-offset-0"
                value={shopId}
                onChange={handleShopChange}
                disabled={ownedShops.length == 0}
                required
              >
                <option value="" disabled>
                  {ownedShops.length == 0 ? "No shop assigned" : "Select your shop"}
                </option>
                {ownedShops.map((shop) => (
                  <option key={shop._id} value={shop._id}>
                    {shop.marketHallNo} - {shop.shopNo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Payment Type</label>
              <select
                className="select select-bordered w-full focus:outline-offset-0"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                required
              >
                <option value="" disabled>Select Payment Type</option>
                <option value="NRC Register Cost">NRC Register Cost</option>
                <option value="Land Rent Cost">Land Rent Cost</option>
                <option value="Overdue Fee">Overdue Fee</option>
              </select>
            </div>

            <div>
              <label className="label">Upload Screenshot(eg.KBZPay screenshot)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentPhoto(e.target.files[0])}
                className="file-input file-input-bordered w-full focus:outline-offset-0"
                required
              />
            </div>

            <div>
              <label className="label">Confirm Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => e.target.value > 0 ? setAmount(e.target.value) : setAmount("")}
                className="input input-bordered w-full focus:outline-offset-0"
              />
            </div>


            <button type="submit" className="btn btn-primary w-full">
              {loading ? <span className="loading loading-spinner loading-xs"></span>
                : "Submit Payment Proof"
              }
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default SubmitPaymentProof;