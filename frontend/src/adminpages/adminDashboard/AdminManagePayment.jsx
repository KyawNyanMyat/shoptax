import React, { useEffect, useRef, useState } from "react";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import usePaymentStatusUpdate from "../../hooks/usePaymentStatusUpdate";
import { useAdminAuthContext } from "../../context/adminAuthContext";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import useDownloadPaymentsPDF from "../../hooks/useDownloadPaymentsPDF";
import { useSocketContext } from "../../context/socketContext";

const AdminManagePayments = () => {
  const { adminAuth } = useAdminAuthContext();
  if (!adminAuth) {
    return <Navigate to={"/admin"} />;
  }

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); 
  const { updateStatus, loading: statusLoading } = usePaymentStatusUpdate();
  const [selectedReject, setSelectedReject] = useState(null); 
  const [rejectionReason, setRejectionReason] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("Pending");
  const [ updatingPaymentId, setUpdatingPaymentId ] = useState(null) // for each row button to be spinner if a user click
  const downloadPDF = useDownloadPaymentsPDF();

  const socket = useSocketContext()
  
  const fetchPayments = async (status="Pending", search="") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payments?search=${encodeURIComponent(search)}&status=${encodeURIComponent(status)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "ငွေပေးချေမှုအချက်အလက် ရယူရာတွင် ပြဿနာတစ်ခု ဖြစ်ပွားနေပါသည်။");
      }
      setPayments(data);
    } catch (err) {
      console.error("ငွေပေးချေမှုများကို ရယူခြင်း မအောင်မြင်ပါ", err);
      toast.error(err.message, { id: "admin-managePayment-error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const addOrReplacePayment = (newPayment) => {
    setPayments(prev => {
      const index = prev.findIndex(p => p._id === newPayment._id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = newPayment;
        return updated;
      } else {
        return [newPayment, ...prev];
      }
    });
  };

  useEffect(()=>{
    if(!socket) return;

    const handleNewPayment = (populatedPayment)=>{
      if (searchTerm === "Pending") {
        setPayments((prev) => [populatedPayment, ...prev]);
      }
      if (searchTerm === "") {
        addOrReplacePayment(populatedPayment);
      }
    }

    const handleFinishedPayment = (updatedPayment) => {
      // Remove it if you're in Pending tab
      if (searchTerm === "Pending") {
        setPayments((prev) => prev.filter(p => p._id !== updatedPayment._id));
      }

      if (searchTerm === "") {
        addOrReplacePayment(updatedPayment);
      }
    }

    const handleRejectedPayment = (rejectedPayment) => {
      if (searchTerm === "Pending") {
        setPayments((prev) => prev.filter(p => p._id !== rejectedPayment._id));
      }
      if (searchTerm === "Rejected") {
        addOrReplacePayment(rejectedPayment);
      }
    }

    socket.on("newPayment", handleNewPayment)
    socket.on("finishedPayment", handleFinishedPayment)
    socket.on("rejectedPayment", handleRejectedPayment);

    return ()=> {
      socket.off("newPayment", handleNewPayment)
      socket.off("finishedPayment", handleFinishedPayment)
      socket.off("rejectedPayment", handleRejectedPayment)
    }
  },[socket, searchTerm])

  return (
    <div className="flex max-h-screen">
      <AdminDashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}  />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminDashboardHeader setSidebarOpen={setSidebarOpen}  />

        <div className="p-6 bg-gray-50 h-screen overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-teal-600">ငွေပေးချေမှုများ စီမံခန့်ခွဲမှု</h2>
          </div>

          <div className="flex items-center gap-4 mb-4">
                <span>အခြေအနေ</span>
                <select
                  className="select select-bordered select-sm focus:outline-offset-0"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    fetchPayments(e.target.value);
                  }}
                >
                  <option value="">အားလုံး ပြမည်</option>
                  <option value="Pending">စောင့်ဆိုင်း</option>
                  <option value="Finished">အောင်မြင်ပြီး</option>
                  <option value="Rejected">ငြင်းဆိုခဲ့သည်</option>
                </select>
                <button
                  className="btn btn-sm btn-accent"
                  onClick={() => downloadPDF(payments)}
                >
                  PDF ထုတ်ယူမည်
                </button>
              </div>

          {loading ? (
            <p>ငွေပေးချေမှုများကို တင်ဆက်နေသည်...</p>
          ) : payments.length === 0 ? (
            <p className="text-gray-500">ငွေပေးချေမှုမရှိပါ။</p>
          ) : (
            <>
              <div className="border border-gray-200 rounded-xl bg-white shadow">
                <div className="p-2 overflow-x-auto">
                  <table className=" divide-gray-200 text-center min-w-[700px] w-full">
                    <thead className="bg-teal-100">
                      <tr className="text-teal-800 text-sm">
                        <th className="px-6 py-3 text-left font-medium">စဉ်</th>
                        <th className="px-6 py-3 text-left font-medium">Payment ID</th>
                        <th className="px-6 py-3 text-left font-medium whitespace-nowrap">အသုံးပြုသူအမည်</th>
                        <th className="px-6 py-3 text-left font-medium">ဆိုင်</th>
                        <th className="px-6 py-3 text-left font-medium whitespace-nowrap">ငွေပေးချေမှုအမျိုးအစား</th>
                        <th className="px-6 py-0 text-left font-medium whitespace-nowrap">ငွေပေးချေမှုဓာတ်ပုံ</th>
                        <th className="px-6 py-3 text-left font-medium whitespace-nowrap">ဆိုင်ဌားခ+ရေအခွန်</th>
                        <th className="px-6 py-3 text-left font-medium">ရက်ကျော်ခ</th>
                        <th className="px-6 py-3 text-left font-medium">စုစုပေါင်းငွေပမာဏ</th>
                        <th className="px-6 py-3 text-left font-medium whitespace-nowrap">စုစုပေါင်း ကျော်သည့်ရက်</th>
                        <th className="px-6 py-3 text-left font-medium">ပေးချေသည့်ရက်</th>
                        <th className="px-6 py-3 text-left font-medium whitespace-nowrap">နောက်ထပ်ငွေပေးချေမည့်ရက်</th>
                        <th className="px-6 py-3 text-left font-medium">အခြေအနေ</th>
                        <th className="px-6 py-3 text-left font-medium">လုပ်ဆောင်မှု</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment, index) => (
                        <tr key={payment._id} className="text-sm">
                          <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{payment._id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{payment.userId.username}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {payment.shopId.marketHallNo} / {payment.shopId.shopNo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {payment.paymentType === "Shop Rent Cost" ? "ဆိုင်ဌားခ+ရေအခွန်" : "ရက်ကျော်ကြေး" }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={payment.paymentPhoto}
                              alt="Payment"
                              className="w-10 h-10 object-cover rounded-md cursor-pointer"
                              onClick={() => setSelectedPhoto(payment.paymentPhoto)} // ဖွင့်ရန်
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{payment.shopFee} ကျပ်</td>
                          <td className="px-6 py-4 whitespace-nowrap">{payment.overDueFee} ကျပ်</td>
                          <td className="px-6 py-4 whitespace-nowrap">{payment.amount} ကျပ်</td>
                          <td className="px-6 py-4 whitespace-nowrap">{payment.overDueDays} ရက်</td>
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(payment.paidDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {payment.paymentType === "Overdue Fee" ? "-" :
                              payment.nextPaymentDueDate
                              ? new Date(payment.nextPaymentDueDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                payment.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : payment.status === "Finished"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {
                                payment.status === "Pending" ? "စောင့်ဆိုင်း" :
                                payment.status === "Finished" ? "အောင်မြင်ပြီး" : "ငြင်းဆိုခဲ့သည်"
                              }
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap space-x-2">
                            { updatingPaymentId === payment._id ? <span className="loading loading-spinner loading-xs"></span> :
                              <div>
                                <button
                                  className="btn bg-success text-white"
                                  disabled={
                                    updatingPaymentId !== null || payment.status !== "Pending"
                                  }
                                  onClick={async () => {
                                    setUpdatingPaymentId(payment._id); // for spinner to start
                                    await updateStatus(payment._id, "Finished", payment.userId._id);
                                    setUpdatingPaymentId(null); // for spinner to end
                                  }}
                                >
                                  လက်ခံမည်
                                </button>

                                <button
                                  className="btn btn-error text-white"
                                  disabled={
                                    updatingPaymentId !== null || payment.status !== "Pending"
                                  }
                                  onClick={()=>{
                                    setSelectedReject(payment);
                                    setRejectionReason("");
                                  }}
                                >
                                  ငြင်းဆိုမည်
                                </button>
                              </div>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={selectedPhoto}
            alt="Zoomed Payment"
            className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {selectedReject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
          onClick={() => setSelectedReject(null)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-red-600">ငြင်းဆိုခြင်းအကြောင်းအရင်း</h2>
            <textarea
              className="textarea textarea-bordered w-full focus:outline-offset-0"
              placeholder="ငြင်းဆိုရခြင်းအကြောင်းအရင်းကို ထည့်ပါ..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            {statusLoading ? (
                <div className="flex justify-center items-center w-full">
                  <span className="loading loading-spinner loading-sm" />
                </div>
              ) : (
              <div className="flex justify-end space-x-2">
                <button
                  className="btn"
                  onClick={() => setSelectedReject(null)}
                >
                  ပိတ်မည်
                </button>
                <button
                  className="btn btn-error text-white"
                  disabled={!rejectionReason.trim()}
                  onClick={async () => {
                    await updateStatus(
                      selectedReject._id,
                      "Rejected",
                      selectedReject.userId._id,
                      rejectionReason
                    );
                    setSelectedReject(null);
                  }}
                >
                  ငြင်းဆိုခြင်းကို အတည်ပြုမည်
                </button>
              </div>
              )
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagePayments;
