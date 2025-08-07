import React, { useEffect, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardSidebar from "../../components/DashboardSidebar";
import toast from "react-hot-toast";
import UseReceiptMarkAsRead from "../../hooks/UseReceiptMarkAsRead";
import { useUserAuthContext } from "../../context/userAuthContext";
import { Navigate } from "react-router-dom";
import { useSocketContext } from "../../context/socketContext";

const Receipts = () => {
  const { userAuth } = useUserAuthContext();
  if (!userAuth) {
    return <Navigate to={"/"} />;
  }

  const [userReceipts, setUserReceipts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userId = userAuth._id;

  const { loadingId, markAsRead } = UseReceiptMarkAsRead();
  const [ loading, setLoading ] = useState(false)
  const socket = useSocketContext()

  useEffect(() => {
    const getReceipt = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/receipts/user/${userId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "တစ်ခုခုမှားယွင်းနေပါသည်");
        setUserReceipts(data);
      } catch (error) {
        console.log("Error in Receipt.jsx", error.message);
        toast.error(error.message, { id: "receipt-error", duration: 1500 });
      }
      finally{
        setLoading(false)
      }
    };

    getReceipt();
  }, []);

  useEffect(()=>{
    if(!socket) return;

    const handleUserNewReceipt = (receipt)=>{
      setUserReceipts(prev => [receipt, ...prev])
    }
    
    const handleReceiptMarkedAsRead = (updatedReceipt)=>{
      setUserReceipts(prev =>
        prev.map(w => w._id === updatedReceipt._id ? updatedReceipt : w)
      );
    }

    socket.on("userNewReceipt", handleUserNewReceipt)
    socket.on("receiptMarkedAsRead", handleReceiptMarkedAsRead)

    return ()=>{
      socket.off("userNewReceipt", handleUserNewReceipt)
      socket.off("receiptMarkedAsRead", handleReceiptMarkedAsRead)
    }
  }, [socket])

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("my-MM", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleReadClick = async (e) => {
    await markAsRead(e.target.value);
  };

  return (
    <div className="flex max-h-screen">
      <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
      <div className="flex-1 flex flex-col">
        <DashboardHeader setSidebarOpen={setSidebarOpen}/>
        <div className="p-6 h-screen overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">သင့်ရဲ့ ပြေစာများ</h2>
          {loading ? (
            <p>ပြေစာများကို တင်ဆက်နေသည်...</p>
          ) :
          userReceipts.length === 0 ? (
            <p className="text-sm text-gray-500 mt-4">ပြေစာများ မရှိသေးပါ။</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userReceipts.map((r) => (
                <div
                  key={r._id}
                  className="bg-white shadow-md rounded-xl p-5 border border-base-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">
                      ဆိုင်ဌားခ
                    </h3>
                    <img
                      src={"/receiptimages/Seal.jpg"}
                      alt="တံဆိပ်"
                      className="w-20 h-20 object-fill rounded-full"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">
                    ထုတ်ပြန်သည့်ရက်စွဲ - {formatDate(r.issueDate)}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    ပြေစာအမှတ် - {r._id}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    ဈေးရုံအမှတ် - {r.paymentId.shopId.marketHallNo}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    ဆိုင်နံပါတ် - {r.paymentId.shopId.shopNo}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    ဆိုင်ရှင်အမည် - {r.paymentId.userId.username}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    ငွေပေးချေသည့်နေ့ -{" "}
                    {new Date(r.paymentId.paidDate).toLocaleString("my-MM", {
                      month: "long",
                      year: "numeric",
                      day: "numeric"
                    })}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    လာမည့်ပေးချေရမည့်နေ့ -{" "}
                    {r.paymentId.paymentType === "Overdue Fee" ? "မရှိပါ" : new Date(r.paymentId.nextPaymentDueDate).toLocaleString("my-MM", {
                      month: "long",
                      year: "numeric",
                      day: "numeric"
                      }) 
                    }
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    ကျော်သည့်ရက် - {r.paymentId.overDueDays} ရက်
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    ဆိုင်ဌားခ - {r.paymentId.shopFee} ကျပ်
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    ရက်ကျော်ခ - {r.paymentId.overDueFee} ကျပ်
                  </p>
                  <p className="text-sm font-medium mt-2">
                    စုစုပေါင်းပေးချေငွေ -{" "}
                    <span className="text-primary">{r.amount} ကျပ်</span>
                  </p>

                  <div className="flex justify-around mt-4">
                    <div className="text-center">
                      <img
                        src={"/receiptimages/mSup.png"}
                        alt="ဈေးတာ၀န်ခံလက်မှတ်"
                        className="h-12 object-contain mx-auto rounded-full"
                      />
                      <p className="text-xs mt-1">{"ဈေးတာ၀န်ခံ"}</p>
                    </div>
                    <div className="text-center">
                      <img
                        src={"/receiptimages/DDSig.png"}
                        alt="အမှုဆောင်အရာရှိလက်မှတ်"
                        className="h-12 object-contain mx-auto rounded-full"
                      />
                      <p className="text-xs mt-1">အမှုဆောင်အရာရှိ</p>
                    </div>
                  </div>

                  <button
                    className="btn btn-success w-full mt-4"
                    disabled={r.isRead || loadingId === r._id}
                    onClick={handleReadClick}
                    value={r._id}
                  >
                    {loadingId == r._id ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : r.isRead ? (
                      "ဖတ်ပြီးပြီးပါပြီ"
                    ) : (
                      "ဖတ်ပြီးဟု သတ်မှတ်မည်"
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Receipts;
