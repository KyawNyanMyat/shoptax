import React, { useEffect, useState } from "react";
import { FiFileText } from "react-icons/fi";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardSidebar from "../../components/DashboardSidebar";
import toast from "react-hot-toast";
import UseReceiptMarkAsRead from "../../hooks/UseReceiptMarkAsRead";

const Receipts = () => {
  const [userReceipts, setUserReceipts] = useState([]);
  const userId = "684c2b1ec0a2a3d814a8d2ca"; // in the future

  const {loadingId, markAsRead} = UseReceiptMarkAsRead()

  useEffect(() => {
    const getReceipt = async () => {
      try {
        const res = await fetch(`/api/receipts/user/${userId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Something went wrong");
        setUserReceipts(data);
      } catch (error) {
        console.log("Error in Receipt.jsx", error.message);
        toast.error(error.message, { duration: 1500 });
      }
    };

    getReceipt();
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const handleReadClick = async (e) => {
    await markAsRead(e.target.value)
    //In the future # socket io
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Your Receipts</h2> 
          {/* Add spinner to the whole receipt In the future  */}
          {userReceipts.length === 0 ? (
            <p className="text-sm text-gray-500 mt-4">No receipts available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {userReceipts.map((r) => (
                <div
                  key={r._id}
                  className="bg-white shadow-md rounded-xl p-5 border border-base-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{r.paymentId.paymentType}</h3>
                    <img
                      src="/images/seal.png"
                      alt="Seal"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Date: {formatDate(r.issueDate)}</p>
                  <p className="text-sm text-gray-500 mb-1">Receipt ID: {r._id}</p>
                  <p className="text-sm text-gray-500 mb-1">
                    Market Hall No: {r.paymentId.shopId.marketHallNo}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    Shop No: {r.paymentId.shopId.shopNo}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    Shopkeeper: {r.paymentId.userId.username}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">
                    For month: {new Date(r.paymentId.paidDate).toLocaleString("default", { month: "long", year: "numeric" })}
                  </p>
                  <p className="text-sm font-medium mt-2">
                    Amount: <span className="text-primary">{r.amount} MMK</span>
                  </p>

                  <div className="flex justify-between mt-4">
                    <div className="text-center">
                      <img
                        src={r.adminId.adminSignaturePhoto}
                        alt="Admin Signature"
                        className="h-12 object-contain mx-auto"
                      />
                      <p className="text-xs mt-1">{r.adminId.adminName}</p>
                    </div>
                    <div className="text-center">
                      <img
                        src={r.superAdminSignaturePhoto}
                        alt="Super Admin Signature"
                        className="h-12 object-contain mx-auto"
                      />
                      <p className="text-xs mt-1">Super Admin</p>
                    </div>
                  </div>

                  <button
                    className="btn btn-success w-full mt-4"
                    disabled={r.isRead || loadingId === r._id}
                    onClick={handleReadClick}
                    value={r._id}
                  >
                    {loadingId == r._id ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : r.isRead ? (
                      "Already Read"
                    ) : (
                      "Mark as Read"
                    )}
                  </button>


                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Receipts;
