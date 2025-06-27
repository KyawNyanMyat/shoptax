import React, { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import useMarkWarningAsRead from "../../hooks/useMarkWarningAsRead";
import { useUserAuthContext } from "../../context/userAuthContext";
import toast from "react-hot-toast";


const WarningMessages = () => {
  const { userAuth } = useUserAuthContext()
  if(!userAuth){
    return <Navigate to={"/"} />
  }
  const userId = userAuth._id;
  const [warnings, setWarnings] = useState([])
  const { markAsRead, loadingId } = useMarkWarningAsRead() 

  useEffect(() => {
    const getWarning = async () => {
      try {
        const res = await fetch(`/api/warnings/user/${userId}`);
        const data = await res.json();
  
        if (!res.ok) throw new Error(data.message || "တခုခုမှားယွင်းနေပါသည်");
        setWarnings(data);
      } catch (error) {
        console.log("Error in Receipt.jsx", error.message);
        toast.error(error.message, {id:"warning-error", duration: 2500})
      }
    };
  
    getWarning();
  }, []);

  const handleMarkAsRead = async (e) => {
    await markAsRead(e.target.value)
    //In the future # socket io
  }
    return (
        <div className="flex min-h-screen">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">သတိပေးစာဆောင်များ</h2>

                <div className="space-y-6">
                    {warnings.map((warn) => (
                    <div
                        key={warn._id}
                        className={`border-l-4 p-4 rounded-xl shadow-sm text-red-800 border-red-200
                          ${warn.warningTitle == "Payment Rejected" ? "bg-amber-200" : "bg-red-200"}`}
                    >
                        <div className="flex items-start gap-3">
                        <FiAlertCircle className="text-xl mt-1" />
                        <div>
                          {/* In the future, add penalty fee */}
                            <h3 className="font-semibold">{warn.warningTitle}</h3>
                            <p className="text-sm mb-1">{warn.warningContent}</p>
                            <p className="text-xs text-gray-500">ထုတ်ပေးသည့်ရက်စွဲ: {warn.issueDate}</p>
                            <button
                              className="btn btn-success mt-4"
                              disabled={warn.isRead || loadingId == warn._id}
                              onClick={handleMarkAsRead}
                              value={warn._id}
                            >
                              {loadingId == warn._id ? (
                                <span className="loading loading-spinner loading-sm"></span>
                              ) : warn.isRead ? (
                                "ဖတ်ပြီးပြီးပါပြီ"
                              ) : (
                                "ဖတ်ပြီးဟု သတ်မှတ်မည်"
                              )}
                            </button>
                        </div>
                        </div>
                    </div>
                    ))}

                    {warnings.length == 0 && (
                    <p className="text-sm text-gray-500">သတိပေးတဲ့စာဆောင်မရှိသေးပါ</p>
                    )}
                </div>
            </div>
          </div>
        </div>
      );
};

export default WarningMessages;
