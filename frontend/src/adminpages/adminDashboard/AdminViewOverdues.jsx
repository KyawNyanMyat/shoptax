import React, { useEffect, useState } from "react";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import { useAdminAuthContext } from "../../context/adminAuthContext";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSocketContext } from "../../context/socketContext";

const AdminViewOverdues = () => {
  const { adminAuth } = useAdminAuthContext();
  if (!adminAuth) {
    return <Navigate to={"/admin"} />;
  }

  const [overdues, setOverdues] = useState([]);
  const [loading, setLoading] = useState(false);
  const socket = useSocketContext()
  
  const fetchOverdues = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/user/overdue");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "အကြွေးတင်ဆိုင်များကို ရယူရာတွင် ပြဿနာတစ်ခု ဖြစ်ပွားနေသည်။");
      }
      setOverdues(data);
    } catch (err) {
      console.error("Overdues fetch failed:", err);
      toast.error(err.message, { id: "admin-viewOverdue-error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverdues();
  }, []);

  useEffect(() => {
    if (!socket) return;
  
    const handleOverdueUpdate = () => {
      fetchOverdues();
    };
  
    socket.on("overdueUpdated", handleOverdueUpdate);
  
    return () => {
      socket.off("overdueUpdated", handleOverdueUpdate);
    };
  }, [socket]);
  

  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <div className="flex-1 max-h-screen overflow-scroll w-4/5">
        <AdminDashboardHeader />

        <div className="p-6 bg-gray-50">
          <h2 className="text-2xl font-bold text-teal-600 mb-6">အကြွေးတင်ဆိုင်များ စာရင်း</h2>
          {loading ? (
            <p>အကြွေးတင်ဆိုင်များ တင်ဆက်နေသည်...</p>
          ) : overdues.length === 0 ? (
            <p>အကြွေးတင်ဆိုင် မရှိပါ။</p>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-y-auto">
              <table className="table w-full text-sm">
                <thead className="bg-teal-100 text-teal-800">
                  <tr>
                    <th>စဉ်</th>
                    <th>အမည်</th>
                    <th>ဈေးအမှတ်</th>
                    <th>ဆိုင်နံပါတ်</th>
                    <th>ငွေပေးချေသည့်လ</th>
                    <th>တင်သွင်းရမည့်ရက်</th>
                    <th>ပေးချေငွေ</th>
                    <th>အကြွေး တင်ထားသောရက်</th>
                  </tr>
                </thead>
                <tbody>
                  {overdues.map((p, i) => (
                    <tr key={p._id}>
                      <td>{i + 1}</td>
                      <td>{p.userId?.username || "မသိရ"}</td>
                      <td>{p.shopId?.marketHallNo}</td>
                      <td>{p.shopId?.shopNo}</td>
                      <td>
                        {new Date(p.paidDate).toLocaleDateString("my-MM", {
                          year: "numeric",
                          month: "long",
                        })}
                      </td>
                      <td>{new Date(p.nextPaymentDueDate).toLocaleDateString()}</td>
                      <td>{p.amount} Ks</td>
                      <td>{p.overdueDays} ရက်</td>
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

export default AdminViewOverdues;
