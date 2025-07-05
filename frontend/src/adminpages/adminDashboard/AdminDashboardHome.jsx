import React, { useEffect, useState } from "react";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import { FiUsers, FiFileText, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { FaUserShield } from "react-icons/fa";
import { useAdminAuthContext } from "../../context/adminAuthContext";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSocketContext } from "../../context/socketContext";

const AdminDashboardHome = () => {
  const { adminAuth } = useAdminAuthContext();
  if (!adminAuth) {
    return <Navigate to={"/admin"} />;
  }

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [pendingPayment, setPendingPayments] = useState(0);
  const [overdueUsers, setOverdueUsers] = useState(0);

  const socket = useSocketContext()

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const userRes = await fetch("/api/users");
        const users = await userRes.json();

        if (!userRes.ok) {
          throw new Error(users.message || "အသုံးပြုသူ အချက်အလက်ရယူရာတွင် ပြဿနာတစ်ခုရှိနေသည်။");
        }
        setTotalUsers(users.length);

        const overdueRes = await fetch("/api/payments/user/overdue");
        const overdue = await overdueRes.json();

        if (!overdueRes.ok) {
          throw new Error(overdue.message || "အသုံးပြုသူ အချက်အလက်ရယူရာတွင် ပြဿနာတစ်ခုရှိနေသည်။");
        }
        setOverdueUsers(overdue.length);

        const adminRes = await fetch("/api/admins");
        const admins = await adminRes.json();

        if (!adminRes.ok) {
          throw new Error(admins.message || "အသုံးပြုသူ အချက်အလက်ရယူရာတွင် ပြဿနာတစ်ခုရှိနေသည်။");
        }
        setTotalAdmins(admins.length);

        const pendingRes = await fetch("/api/payments/pending");
        const pending = await pendingRes.json();

        if (!pendingRes.ok) {
          throw new Error(pending.message || "အသုံးပြုသူ အချက်အလက်ရယူရာတွင် ပြဿနာတစ်ခုရှိနေသည်။");
        }
        setPendingPayments(pending.length);

      } catch (error) {
        console.error("ဒက်ရှ်ဘုတ်အချက်အလက် ရယူရာတွင် ပြဿနာ:", error);
        toast.error(error.message, { id: "admin-dashboard-error" });
      }
    };

    fetchCounts();
  }, []);

  //socket
  useEffect(()=>{
    if(!socket) return;

    socket.on("newAdminCreated",(adminObj)=>{
      setTotalAdmins(prev => prev + 1)
    })

    socket.on("newUserCreated",(userObj)=>{
      setTotalUsers(prev => prev + 1)
    })

    socket.on("newPayment",(populatedPayment)=>{
      setPendingPayments(prev => prev + 1)
    })

    socket.on("finishedPayment",(updated)=>{
      setPendingPayments(prev => prev - 1)
    })

    socket.on("rejectedPayment",(updated)=>{
      setPendingPayments(prev => prev - 1)
    })
    return ()=>{
      socket.off("newAdminCreated")
      socket.off("newUserCreated")
      socket.off("newPayment")
      socket.off("finishedPayment")
      socket.off("rejectedPayment")
    }
  },[socket])

  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <div className="flex-1 flex flex-col h-full w-4/5">
        <AdminDashboardHeader />

        <div className="p-6 space-y-6 bg-gray-50 min-h-full">
          {/* ကြိုဆိုစာသား */}
          <div>
            <h2 className="text-2xl font-bold text-teal-600">မင်္ဂလာပါ၊ အုပ်ချုပ်ရေးဝင်</h2>
            <p className="text-sm text-gray-600">မြို့နယ်ဆိုင်ရာ လုပ်ဆောင်ချက်များအတွက် အနှစ်ချုပ်</p>
          </div>

          {/* အနှစ်ချုပ်ကဒ်များ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
              <FiUsers className="text-2xl text-teal-600" />
              <div>
                <p className="text-lg font-bold">{totalUsers}</p>
                <p className="text-sm text-gray-500">စုစုပေါင်း အသုံးပြုသူ</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
              <FaUserShield className="text-2xl text-teal-600" />
              <div>
                <p className="text-lg font-bold">{totalAdmins}</p>
                <p className="text-sm text-gray-500">စုစုပေါင်း အုပ်ချုပ်ရေးဝင်</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
              <FiCheckCircle className="text-2xl text-teal-600" />
              <div>
                <p className="text-lg font-bold">{pendingPayment}</p>
                <p className="text-sm text-gray-500">ဆိုင်းငံ့နေသော ငွေပေးချေမှု</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
              <FiAlertCircle className="text-2xl text-teal-600" />
              <div>
                <p className="text-lg font-bold">{overdueUsers}</p>
                <p className="text-sm text-gray-500">ငွေပေးချေရန်ရက်ကျော်သွားသူများ</p>
              </div>
            </div>
          </div>

          {/* စည်းမျဉ်းများ */}
          <div className="bg-white shadow rounded-xl p-6 mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">အုပ်ချုပ်ရေးစည်းမျဉ်းများ</h3>
            <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
              <li>အခွန်ပေးချေမှုများကို လစဉ် ၅ရက်မတိုင်မီ မှတ်တမ်းတင်ပြီးစီးထားရမည်။</li>
              <li>ဆိုင်များသည် လိုင်စင်ကို နှစ်စဉ် စာရွက်စာတမ်းအသစ်ဖြင့် ပြန်လည်တင်သွင်းရမည်။</li>
              <li>သန့်ရှင်းရေးစစ်ဆေးမှုကို ၂ ပတ် တစ်ကြိမ် ပြုလုပ်မည်ဖြစ်၍ အမြဲသန့်ရှင်းကြရမည်။</li>
              <li>ခွင့်ပြုချက်မရှိသော ဆိုင်ခုံများကို သတိပေးချက် ၅ ကြိမ်အကြောင်းကြားပြီးနောက် ဖယ်ရှားမည်။</li>
              <li>အုပ်ချုပ်ရေးဝင်များသည် ကြာမြင့်သော ငွေပေးချေသူစာရင်းကို အပတ်စဉ် ပြုပြင်ရမည်။</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
