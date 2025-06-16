import React, { useEffect, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardSidebar from "../../components/DashboardSidebar";
import toast from "react-hot-toast";
import useSubmitPayment from "../../hooks/useSubmitPayment";

const SubmitPaymentProof = () => {

  const userId = "684c2b1ec0a2a3d814a8d2ca"; // in the future
  const [userName, setUserName] = useState("");
  const [marketHallNo, setMarketHallNo] = useState("");
  const [shopNo, setShopNo] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [paymentPhoto, setPaymentPhoto] = useState("");
  const [amount, setAmount] = useState("");
  const [shopId, setShopId] = useState("");

  const { loading, submitPayment } = useSubmitPayment()

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Something went wrong");
      
        setUserName(data.username)
        setShopId(data.shopId)
        setMarketHallNo(data.shopId.marketHallNo)
        setShopNo(data.shopId.shopNo)
        
      } catch (error) {
        console.log("Error in Receipt.jsx", error.message);
      }
    };

    getUserInfo();
  }, []);


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
    formData.append("shopId", shopId._id);
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
            Upload a screenshot of your payment (e.g., KBZPay, WavePay). Please ensure the date and amount are clearly visible.
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Market Hall No</label>
                <input
                  type="text"
                  value={marketHallNo}
                  disabled
                  className="input input-bordered w-full bg-gray-100 focus:outline-offset-0"
                />
              </div>
              <div>
                <label className="label">Shop No</label>
                <input
                  type="text"
                  value={shopNo}
                  disabled
                  className="input input-bordered w-full bg-gray-100 focus:outline-offset-0"
                />
              </div>
            </div>


            <div>
              <label className="label">Payment Type</label>
              <select
                className="select select-bordered w-full focus:outline-offset-0"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                required
              >
                <option value="" disabled>Select payment type</option>
                <option value="NRC Register Cost">NRC Register Cost</option>
                <option value="Land Rent Cost">Land Rent Cost</option>
              </select>
            </div>

            <div>
              <label className="label">Upload Screenshot</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentPhoto(e.target.files[0])}
                className="file-input file-input-bordered w-full focus:outline-offset-0"
                required
              />
            </div>

            <div>
              <label className="label">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input input-bordered w-full focus:outline-offset-0"
                required
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