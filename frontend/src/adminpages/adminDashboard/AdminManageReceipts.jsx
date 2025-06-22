// pages/admin/AdminManageReceipts.jsx
import React, { useEffect, useState } from "react";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";

const AdminManageReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReceipts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/receipts"); // proxy set already
        const data = await res.json();
        console.log(data)
        setReceipts(data);
      } catch (err) {
        console.error("Error fetching receipts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <div className="flex-1 flex flex-col h-full w-4/5">
        <AdminDashboardHeader />

        <div className="p-6 bg-gray-50 min-h-full">
          <h2 className="text-2xl font-bold text-teal-600 mb-6">Manage Receipts</h2>

          {loading ? (
            <p>Loading receipts...</p>
          ) : receipts.length === 0 ? (
            <p>No receipts found.</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="table w-full">
                <thead className="bg-teal-100 text-teal-800 text-sm">
                  <tr>
                    <th>No</th>
                    <th>Receipt ID</th>
                    <th>Admin</th>
                    <th>Payment Type</th>
                    <th>User</th>
                    <th>Amount</th>
                    <th>Issue Date</th>
                    <th>isRead</th>
                    <th>Signature</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {receipts.map((r, index) => (
                    <tr key={r._id}>
                      <td>{index + 1}</td>
                      <td>{r._id}</td>
                      <td>{r.adminId?.adminName}</td>
                      <td>{r.paymentId?.paymentType}</td>
                      {/* In the future change */}
                      <td>{r.paymentId?.userId?.username}</td>
                      <td>{r.amount} Ks</td>
                      <td>{new Date(r.issueDate).toLocaleDateString()}</td>
                      <td>{r.isRead ? "Yes" : "No"}</td>
                      <td>
                        {/* In the future change */}
                        <img
                          src={r.superAdminSignaturePhoto}
                          alt="Signature"
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
