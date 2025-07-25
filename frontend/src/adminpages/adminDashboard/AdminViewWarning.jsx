import React, { useEffect, useState } from "react";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import { useAdminAuthContext } from "../../context/adminAuthContext";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSocketContext } from "../../context/socketContext";

const AdminViewWarnings = () => {
  const { adminAuth } = useAdminAuthContext();
  if (!adminAuth) {
    return <Navigate to={"/admin"} />;
  }

  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const socket = useSocketContext()

  useEffect(() => {
    const fetchWarnings = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/warnings");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "သတိပေးချက်အချက်အလက်များကို ရယူရာတွင် ပြဿနာတစ်ခု ဖြစ်ပွားနေသည်။");
        }
        setWarnings(data);
      } catch (err) {
        console.error("သတိပေးချက်များ ရယူခြင်း မအောင်မြင်ပါ:", err);
        toast.error(err.message, { id: "admin-viewWarning-error" });
      } finally {
        setLoading(false);
      }
    };
    fetchWarnings();
  }, []);

  useEffect(() => {
    if (!socket) return;
  
    const handleAdminRejectedWarning = (warning) => {
      setWarnings(prev => [ warning, ...prev]);
    };
  
    const handleAdminJustWarning = (warning) => {
      setWarnings(prev => [ warning, ...prev ]);
    };
  
    const handleUserWarningMarkedAsRead = (updatedWarning) => {
      setWarnings(prev =>
        prev.map(w => w._id === updatedWarning._id ? updatedWarning : w)
      );
    };
  
    socket.on("adminRejectedWarning", handleAdminRejectedWarning);
    socket.on("adminJustWarning", handleAdminJustWarning);
    socket.on("userWarningMarkedAsRead", handleUserWarningMarkedAsRead);
  
    return () => {
      socket.off("adminRejectedWarning", handleAdminRejectedWarning);
      socket.off("adminJustWarning", handleAdminJustWarning);
      socket.off("userWarningMarkedAsRead", handleUserWarningMarkedAsRead);
    };
  }, [socket]);
  
  
  return (
    <div className="flex max-h-screen">
      <AdminDashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminDashboardHeader setSidebarOpen={setSidebarOpen} />

        <div className="p-6 bg-gray-50 h-screen overflow-y-auto">
          <h2 className="text-2xl font-bold text-teal-600 mb-6">သတိပေးချက် စာရင်းအားလုံး</h2>
          {loading ? (
            <p>သတိပေးချက်များကို တင်ဆက်နေသည်...</p>
          ) : warnings.length === 0 ? (
            <p>သတိပေးချက် မရှိသေးပါ။</p>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-x-auto">
              <table className="table min-w-[700px] w-full text-sm">
                <thead className="bg-teal-100 text-teal-800">
                  <tr>
                    <th>စဉ်</th>
                    <th>အသုံးပြုသူအမည်</th>
                    <th>ခေါင်းစဉ်</th>
                    <th>အကြောင်းအရာ</th>
                    <th>အကြွေးတင် ငွေပမာဏ</th>
                    <th>ထုတ်ပြန်သည့်ရက်</th>
                    <th>ဖတ်ပြီးသလား</th>
                  </tr>
                </thead>
                <tbody>
                  {warnings.map((w, i) => (
                    <tr key={w._id}>
                      <td>{i + 1}</td>
                      <td>{w.userId?.username}</td>
                      <td>{w.warningTitle}</td>
                      <td className="min-w-[200px] max-w-[300px]">{w.warningContent}</td>
                      <td>{w.overdueFee} Ks</td>
                      <td>{new Date(w.issueDate).toLocaleDateString()}</td>
                      <td>{w.isRead ? "ဖတ်ပြီး" : "မဖတ်ရသေးပါ"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminViewWarnings;
