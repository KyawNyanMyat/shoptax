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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
        const tempOverdue = overdue.filter((p)=> p.paymentType !== "Overdue Fee")
        setOverdueUsers(tempOverdue.length);

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

    const handleNewAdminCreated = (adminObj)=>{
      setTotalAdmins(prev => prev + 1)
    }

    const handleNewUserCreated = (userObj)=>{
      setTotalUsers(prev => prev + 1)
    }

    const handleNewPayment = (populatedPayment)=>{
      setPendingPayments(prev => prev + 1)
    }

    const handleFinishedPayment = (updated)=>{
      setPendingPayments(prev => prev - 1)
    }

    const handleRejectedPayment = (updated)=>{
      setPendingPayments(prev => prev - 1)
    }

    const handleOverdueUpdated = (count) => {
      setOverdueUsers(count);
    }

    socket.on("newAdminCreated", handleNewAdminCreated)
    socket.on("newUserCreated", handleNewUserCreated)
    socket.on("newPayment",handleNewPayment)
    socket.on("finishedPayment",handleFinishedPayment)
    socket.on("rejectedPayment",handleRejectedPayment)
    socket.on("overdueUpdated", handleOverdueUpdated);

    return ()=>{
      socket.off("newAdminCreated", handleNewAdminCreated)
      socket.off("newUserCreated", handleNewUserCreated)
      socket.off("newPayment", handleNewPayment)
      socket.off("finishedPayment", handleFinishedPayment)
      socket.off("rejectedPayment", handleRejectedPayment)
      socket.off("overdueUpdated", handleOverdueUpdated)
    }
  },[socket])

  return (
    <div className="flex max-h-screen">
      <AdminDashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <AdminDashboardHeader setSidebarOpen={setSidebarOpen} />

        <div className="p-6 space-y-6 bg-gray-50 h-screen overflow-y-auto">
          <div>
            <h2 className="text-2xl font-bold text-teal-600">မင်္ဂလာပါ၊ {adminAuth?.adminName}</h2>
{/*             <p className="text-sm text-gray-600">မြို့နယ်ဆိုင်ရာ လုပ်ဆောင်ချက်များအတွက် အနှစ်ချုပ်</p> */}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-sm text-gray-500">စုစုပေါင်း ဈေးတာ၀န်ခံ</p>
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
                <p className="text-sm text-gray-500">ငွေပေးချေရန်ရက်ကျော်ဆိုင်များ</p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-xl p-6 mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">စည်းမျဉ်းများ</h3>
            <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
              <li>ဈေးတာ၀န်ခံသည် ငွေပေးချေမှုများကို လက်ခံခြင်း သို့မဟုတ် ပယ်ဖျက်ခြင်း ပြုလုပ်နိုင်သည်။</li>
              {/* <li>ဈေးတာ၀န်ခံသည် အချိန်ကျော်လွန်ထားသော ငွေပေးချေမှုများ (overdue) ကို ကြည့်ရှုနိုင်သည်။</li> */}
              <li>အချိန်ကျော်လွန်နေသော အသုံးပြုသူများရှိပါက၊ ဈေးတာ၀န်ခံသည် တစ်ရက်တစ်ကြိမ်သာ သတိပေးချက် ပေးပို့ရမည်။</li>
              <li>သတိပေးချက်တစ်ခုလျှင် အပိုဆောင်းအကြေး (overdue fee) အဖြစ် ၁၀၀ ကျပ် သတ်မှတ်ထားသည်။</li>
              <li>ဆိုင်ပိုင်ရှင်သည် ၅ ရက်အထက်အချိန်ကျော်လွန်ခဲ့ပါက၊ ဈေးတာ၀န်ခံသည် ထိုအသုံးပြုသူအား ဆိုင်မှ ဖြုတ်ပစ်ရမည်။</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
