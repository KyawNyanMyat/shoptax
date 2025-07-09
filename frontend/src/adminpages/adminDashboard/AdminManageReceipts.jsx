import React, { useEffect, useState } from "react";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import { useAdminAuthContext } from "../../context/adminAuthContext";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSocketContext } from "../../context/socketContext";

const AdminManageReceipts = () => {
  const { adminAuth } = useAdminAuthContext();
  if (!adminAuth) {
    return <Navigate to={"/admin"} />;
  }

  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const socket = useSocketContext()

  useEffect(() => {
    const fetchReceipts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/receipts");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "ငွေလက်ခံဖြတ်ပိုင်းအချက်အလက်များ ရယူရာတွင် ပြဿနာတစ်ခု ဖြစ်ပွားနေသည်။");
        }

        setReceipts(data);
      } catch (err) {
        console.error("ငွေလက်ခံဖြတ်ပိုင်းများ ရယူမှုအမှား:", err);
        toast.error(err.message, { id: "admin-manageReceipt-error" });
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  useEffect(()=>{
    if(!socket) return;

    const handleNewReceipt = (receipt)=>{
      setReceipts(prev => [...prev, receipt])
    }

    const handleUserReceiptMarkedAsRead = (updatedReceipt) => {
      setReceipts(prev =>
        prev.map(w => w._id === updatedReceipt._id ? updatedReceipt : w)
      );
    }

    socket.on("newReceipt", handleNewReceipt)
    socket.on("userReceiptMarkedAsRead", handleUserReceiptMarkedAsRead ); 

    return ()=>{
      socket.off("newReceipt", handleNewReceipt)
      socket.off("userReceiptMarkedAsRead", handleUserReceiptMarkedAsRead)
    }
  }, [socket])

  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <div className="flex-1 flex flex-col max-h-screen w-4/5">
        <AdminDashboardHeader />

        <div className="p-6 bg-gray-50 overflow-scroll">
          <h2 className="text-2xl font-bold text-teal-600 mb-6">ငွေလက်ခံဖြတ်ပိုင်း စီမံခြင်း</h2>

          {loading ? (
            <p>ငွေလက်ခံဖြတ်ပိုင်းများ တင်ဆက်နေသည်...</p>
          ) : receipts.length === 0 ? (
            <p>လက်ခံဖြတ်ပိုင်း မတွေ့ရှိပါ။</p>
          ) : (
            <div className=" bg-white rounded-xl shadow">
              <table className="table w-full">
                <thead className="bg-teal-100 text-teal-800 text-sm">
                  <tr>
                    <th>စဉ်</th>
                    <th>ဖြတ်ပိုင်းအမှတ်</th>
                    <th>အက်မင်အမည်</th>
                    <th>ငွေပေးချေမှုအမျိုးအစား</th>
                    <th>အသုံးပြုသူအမည်</th>
                    <th>ပမာဏ</th>
                    <th>ထုတ်ပေးသည့်ရက်</th>
                    <th>ဖတ်ပြီး/မဖတ်ရသေး</th>
                    <th>လက်မှတ်</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {receipts.map((r, index) => (
                    <tr key={r._id}>
                      <td>{index + 1}</td>
                      <td>{r._id}</td>
                      <td>{r.adminId?.adminName}</td>
                      <td>{r.paymentId?.paymentType}</td>
                      <td>{r.paymentId?.userId?.username}</td>
                      <td>{r.amount} Ks</td>
                      <td>{new Date(r.issueDate).toLocaleDateString()}</td>
                      <td>{r.isRead ? "ဖတ်ပြီး" : "မဖတ်ရသေးပါ"}</td>
                      <td>
                        <img
                          src={"#"}
                          alt="လက်မှတ်"
                          className="w-10 h-10 object-cover"
                        />
                      </td>
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

export default AdminManageReceipts;
