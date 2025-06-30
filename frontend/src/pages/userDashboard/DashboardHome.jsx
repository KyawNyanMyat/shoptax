import { useEffect, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardSidebar from "../../components/DashboardSidebar";
import toast from "react-hot-toast";
import { useUserAuthContext } from "../../context/userAuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const DashboardHome = () => {
  const { userAuth, setUserAuth } = useUserAuthContext()
  if(!userAuth){
    return <Navigate to={"/"} />
  }

  const userId = userAuth._id; 
  const today = new Date().toLocaleDateString();

  const [userName, setUserName] = useState("")
  const [lastPayment, setLastPayment] = useState(null)
  const [nextPaymentDueDate, setNextPaymentDueDate] = useState(null)
  const [unReadWarning, setUnReadWarning] = useState([])
  const [unReadReceipt, setUnReadReceipt] = useState([])

  const summary = [
    {
      label: "နောက်ဆုံး ငွေပေးချေမှု ရက်စွဲ",
      value: lastPayment
        ? new Date(lastPayment).toLocaleDateString("en-CA")
        : "မရှိသေးပါ",
      color: "bg-green-100 text-green-800",
    },
    {
      label: "လာမည့် ပေးချေရမည့် ရက်စွဲ",
      value: nextPaymentDueDate
        ? new Date(nextPaymentDueDate).toLocaleDateString("en-CA")
        : "မရှိသေးပါ",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      label: "မဖတ်ရသေးသော သတိပေးချက်များ",
      value: unReadWarning.length > 0 ? unReadWarning.length : 0,
      color: "bg-red-100 text-red-800",
    },
    {
      label: "မဖတ်ရသေးသော ငွေသက်သေ စာရွက်များ",
      value: unReadReceipt.length > 0 ? unReadReceipt.length : 0,
      color: "bg-blue-100 text-blue-800",
    },
  ];
  

  const regulations = [
    "အရောင်းဆိုင်များသည် လစဉ်ဆိုင်ခွန်ကို တစ်လတစ်ကြိမ် ပြန်လည်ပေးဆောင်ရမည်။",
    "အမှိုက်များကို အသုံးမပြုရသောနေရာများတွင် ပစ်ချပေးခွင့်မရှိပါ။",
    "ဆိုင်အမှတ်နှင့် စျေးအမှတ်တို့ကို ဖျက်ဆီးခြင်း မပြုရ။",
    "အများသုံးလမ်းများတွင် ကုန်ပစ္စည်းများ ချထားခြင်းကို တားမြစ်ပါသည်။",
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

        setUserName(userData.username)
        setLastPayment(data.paidDate)
        setNextPaymentDueDate(data.nextPaymentDueDate)
        setUnReadReceipt(receiptData)
        setUnReadWarning(warningData)

      } catch (error) {
        console.log("Error in Dashboard Home", error.message)
        toast.error(error.message, { id: 'dashboard-error', duration: 2500 })
      }
    }

    forDashBoard()
  },[])

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        {/* In the future Clicking these four */}
        {/* Dashboard home */}
        <div className="p-6 space-y-10">
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
