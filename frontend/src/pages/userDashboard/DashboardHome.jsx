import { useEffect, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardSidebar from "../../components/DashboardSidebar";
import toast from "react-hot-toast";
import { useUserAuthContext } from "../../context/userAuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useSocketContext } from "../../context/socketContext";

const DashboardHome = () => {
  const { userAuth, setUserAuth } = useUserAuthContext()
  if(!userAuth){
    return <Navigate to={"/"} />
  }

  const userId = userAuth._id; 
  const today = new Date().toLocaleDateString();

  const [userName, setUserName] = useState("")
  const [lastPayment, setLastPayment] = useState(null)
  const [shopCount, setShopCount] = useState([])
  const [unReadWarning, setUnReadWarning] = useState([])
  const [unReadReceipt, setUnReadReceipt] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const socket = useSocketContext()

  const summary = [
    {
      label: "နောက်ဆုံး ငွေပေးချေမှု ရက်စွဲ",
      value: lastPayment
        ? new Date(lastPayment).toLocaleDateString()
        : "မရှိသေးပါ",
      color: "bg-green-100 text-green-800",
    },
    {
      label: "သင်ပိုင်ဆိုင်သောဆိုင် အရေတွက်",
      value: shopCount.length > 0 ? shopCount.length : 0,
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      label: "မဖတ်ရသေးသော သတိပေးချက်များ",
      value: unReadWarning.length > 0 ? unReadWarning.length : 0,
      color: "bg-red-100 text-red-800",
    },
    {
      label: "မဖတ်ရသေးသောပြေစာများ",
      value: unReadReceipt.length > 0 ? unReadReceipt.length : 0,
      color: "bg-blue-100 text-blue-800",
    },
  ];
  

  const regulations = [
    "အရောင်းဆိုင်များသည် လစဉ်ဆိုင်ခွန်ကို တစ်လတစ်ကြိမ် ပြန်လည်ပေးဆောင်ရမည်။",
    "ရက်ကျော်ပါက စုစုပေါင်းရက်ကျော်ခနှင့် လစဥ်ဆိုင်ခွန်ခ ကိုပါတခါတည်းပေးဆောင်ရမည်။ ရက်ကျော်ခသည် တနေ့ ၁၀၀ ကျပ်ဖြစ်သည်။",
    "အမှိုက်များကို အသုံးမပြုရသောနေရာများတွင် ပစ်ချပေးခွင့်မရှိပါ။",
    "ဆိုင်အမှတ်နှင့် စျေးအမှတ်တို့ကို ဖျက်ဆီးခြင်း မပြုရ။",
    "အချက်အလက်အမှားများကို စနစ်တကျ ပြင်ဆင်ရန် တာဝန်ရှိသည်။",
    "အသုံးပြုသူအမည်နှင့် ဆိုင်အချက်အလက်သည် တိကျမှန်ကန်ရမည်။",
  ];
  
  

  useEffect(()=>{
    const forDashBoard = async()=>{
      try {

        const userRes = await fetch(`/api/users/${userId}`)
        const userData = await userRes.json()
        
        if (!userRes.ok) {
          throw new Error(userData.message || "အသုံးပြုသူ အချက်အလက်ရယူရာတွင် ပြဿနာတစ်ခုရှိနေသည်။");
        }

        const res = await fetch(`/api/payments/user/${userId}`)
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "အသုံးပြုသူ အချက်အလက်ရယူရာတွင် ပြဿနာတစ်ခုရှိနေသည်။");
        }

        const receiptRes = await fetch(`/api/receipts/unread/${userId}`)
        const receiptData = await receiptRes.json();

        if (!receiptRes.ok) {
          throw new Error(receiptData.message || "အသုံးပြုသူ အချက်အလက်ရယူရာတွင် ပြဿနာတစ်ခုရှိနေသည်။");
        }

        const warningRes = await fetch(`/api/warnings/unread/${userId}`)
        const warningData = await warningRes.json();

        if (!warningRes.ok) {
          throw new Error(warningData.message || "အသုံးပြုသူ အချက်အလက်ရယူရာတွင် ပြဿနာတစ်ခုရှိနေသည်။");
        }

        const ownShops = await fetch(`/api/shops/user/${userId}`)
        const ownShopsData = await ownShops.json()

        if(!ownShops.ok) {
          throw new Error(ownShopsData.message || "အသုံးပြုသူ အချက်အလက်ရယူရာတွင် ပြဿနာတစ်ခုရှိနေသည်။")
        }

        setUserName(userData.username)
        setLastPayment(data.paidDate)
        setShopCount(ownShopsData)
        setUnReadReceipt(receiptData)
        setUnReadWarning(warningData)

      } catch (error) {
        console.log("Error in Dashboard Home", error.message)
        toast.error(error.message, { id: 'dashboard-error', duration: 2500 })
      }
    }

    forDashBoard()
  },[])

  useEffect(() => {
    if (!socket) return;
  
    const handleUserNewReceipt = (receipt) => {
      setUnReadReceipt(prev => [...prev, receipt]);
    };
  
    const handleRejectWarning = (warning) => {
      setUnReadWarning(prev => [...prev, warning]);
    };
  
    const handleJustWarning = (warning) => {
      setUnReadWarning(prev => [...prev, warning]);
    };
  
    const handleWarningMarkedAsRead = (updatedWarning) => {
      setUnReadWarning(prev => prev.filter(w => w._id !== updatedWarning._id));
    };
  
    const handleReceiptMarkedAsRead = (updatedReceipt) => {
      setUnReadReceipt(prev => prev.filter(r => r._id !== updatedReceipt._id));
    };
  
    const handleShopRemoved = (shop) => {
      setShopCount(prevShops => prevShops.filter(s => s._id !== shop._id));
    };
  
    const handleShopAssigned = (updatedShop) => {
      setShopCount(prevShops => [...prevShops, updatedShop]);
    };
  
    const handleNewPayment = (populatedPayment) => {
      setLastPayment(populatedPayment.paidDate);
    };
  
    socket.on("userNewReceipt", handleUserNewReceipt);
    socket.on("rejectWarning", handleRejectWarning);
    socket.on("justWarning", handleJustWarning);
    socket.on("warningMarkedAsRead", handleWarningMarkedAsRead);
    socket.on("receiptMarkedAsRead", handleReceiptMarkedAsRead);
    socket.on("shopRemoved", handleShopRemoved);
    socket.on("shopAssigned", handleShopAssigned);
    socket.on("newPayment", handleNewPayment);
  
    return () => {
      socket.off("userNewReceipt", handleUserNewReceipt);
      socket.off("rejectWarning", handleRejectWarning);
      socket.off("justWarning", handleJustWarning);
      socket.off("warningMarkedAsRead", handleWarningMarkedAsRead);
      socket.off("receiptMarkedAsRead", handleReceiptMarkedAsRead);
      socket.off("shopRemoved", handleShopRemoved);
      socket.off("shopAssigned", handleShopAssigned);
      socket.off("newPayment", handleNewPayment);
    };
  }, [socket]);
  

  return (
    <div className="flex max-h-screen">
      <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader setSidebarOpen={setSidebarOpen}/>
        
        {/* Dashboard home */}
        <div className="p-6 space-y-10 h-screen overflow-y-auto">
          <div>
            <h2 className="text-2xl font-bold">မင်္ဂလာပါ {userName}!</h2>
            <p className="text-sm text-gray-500">ယနေ့ ရက်စွဲ - {today}</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {summary.map((item, idx) => (
              <div
                key={idx}
                className={`card ${item.color} shadow-md p-4 rounded-2xl`}
              >
                <h3 className="text-sm font-medium">{item.label}</h3>
                <p className="text-lg font-bold">
                  {item.value !== null && item.value !== undefined
                    ? item.value
                    : <span className="loading loading-spinner loading-xs"></span>}
                </p>

              </div>
            ))}
          </div>

          {/* Township Regulations */}
          <div>
            <h3 className="text-xl font-semibold mb-3">ဈေးစည်းကမ်းချက်များ</h3>
            <ul className="list-disc pl-6 text-sm text-gray-700 space-y-2">
              {regulations.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
