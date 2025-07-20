import React, { useEffect, useState } from "react";
import { FiAlertCircle } from "react-icons/fi";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import useMarkWarningAsRead from "../../hooks/useMarkWarningAsRead";
import { useUserAuthContext } from "../../context/userAuthContext";
import toast from "react-hot-toast";
import { useSocketContext } from "../../context/socketContext";


const WarningMessages = () => {
  const { userAuth } = useUserAuthContext()
  if(!userAuth){
    return <Navigate to={"/"} />
  }
  const userId = userAuth._id;
  const [warnings, setWarnings] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { markAsRead, loadingId } = useMarkWarningAsRead()
  const [ loading, setLoading ] = useState(false)
  const socket = useSocketContext()

  useEffect(() => {
    const getWarning = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/warnings/user/${userId}`);
        const data = await res.json();
  
        if (!res.ok) throw new Error(data.message || "တခုခုမှားယွင်းနေပါသည်");
        setWarnings(data);
      } catch (error) {
        console.log("Error in Receipt.jsx", error.message);
        toast.error(error.message, {id:"warning-error", duration: 2500})
      }
      finally{
        setLoading(false)
      }
    };
  
    getWarning();
  }, []);

  useEffect(() => {
    if (!socket) return;
  
    const handleRejectWarning = (warning) => {
      setWarnings(prev => [ warning, ...prev]);
    };
  
    const handleJustWarning = (warning) => {
      setWarnings(prev => [ warning, ...prev]);
    };
  
    const handleWarningMarkedAsRead = (updatedWarning) => {
      setWarnings(prev =>
        prev.map(w => w._id === updatedWarning._id ? updatedWarning : w)
      );
    };
  
    socket.on("rejectWarning", handleRejectWarning);
    socket.on("justWarning", handleJustWarning);
    socket.on("warningMarkedAsRead", handleWarningMarkedAsRead);
  
    return () => {
      socket.off("rejectWarning", handleRejectWarning);
      socket.off("justWarning", handleJustWarning);
      socket.off("warningMarkedAsRead", handleWarningMarkedAsRead);
    };
  }, [socket]);
  

  const handleMarkAsRead = async (e) => {
    await markAsRead(e.target.value)
  }
    return (
        <div className="flex max-h-screen">
          <DashboardSidebar  sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
          <div className="flex-1 flex flex-col">
            <DashboardHeader setSidebarOpen={setSidebarOpen} />
            
            <div className="p-6 h-screen overflow-y-auto">
                <h2 className="text-2xl font-bold mb-6">သတိပေးစာဆောင်များ</h2>
                  {loading ? (
                    <p>သတိပေးတဲ့စာဆောင်များကို တင်ဆက်နေသည်...</p>
                  ) :
                  warnings.length === 0 ? (
                      <p className="text-sm text-gray-500">သတိပေးတဲ့စာဆောင်မရှိသေးပါ</p>
                    ) : (
                      <div className="space-y-6">
                      {warnings.map((warn) => (
                      <div
                          key={warn._id}
                          className={`border-l-4 p-4 rounded-xl shadow-sm text-red-800 border-red-200
                            ${warn.warningTitle == "ငွေပေးချေမှု ပယ်ဖျက်ခြင်း" ? "bg-amber-100" : "bg-red-200"}`}
                      >
                          <div className="flex items-start gap-3">
                          <FiAlertCircle className="text-xl mt-1" />
                          <div>
                              <h3 className="font-semibold">{warn.warningTitle}</h3>
                              <p className="text-sm mb-1">{warn.warningContent}</p>
                              <p className="text-sm mb-1 text-blue-500">အခကြေးငွေ{warn.overdueFee}</p>
                              <p className="text-xs text-green-600">ထုတ်ပေးသည့်ရက်စွဲ: {new Date(warn.issueDate).toLocaleDateString()}</p>
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
                  </div>
                    )
                  }
            </div>
          </div>
        </div>
      );
};

export default WarningMessages;
