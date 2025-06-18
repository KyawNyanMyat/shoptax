import React, { useEffect, useState } from "react";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";

const AdminManagePayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/payments");
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <div className="flex-1 flex flex-col h-full w-4/5">
        <AdminDashboardHeader />

        <div className="p-6 bg-gray-50 min-h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-teal-600">Manage Payments</h2>
            </div>

            {loading ? (
                <p>Loading payments...</p>
            ) : payments.length == 0 ? (
                <p className="text-gray-500">No payments found.</p>
            ) : (
                <div className="border border-gray-200 rounded-xl bg-white shadow overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto">
                    <table className="divide-y divide-gray-200">
                    <thead className="bg-teal-100">
                        <tr className="text-teal-800 text-sm">
                        <th className="px-6 py-3 text-left font-medium">No</th>
                        <th className="px-6 py-3 text-left font-medium">PaymentID</th>
                        <th className="px-6 py-3 text-left font-medium">UserId</th>
                        <th className="px-6 py-3 text-left font-medium">ShopId</th>
                        <th className="px-6 py-3 text-left font-medium">Type</th>
                        <th className="px-6 py-3 text-left font-medium">Photo</th>
                        <th className="px-6 py-3 text-left font-medium">Amount</th>
                        <th className="px-6 py-3 text-left font-medium">Paid Date</th>
                        <th className="px-6 py-3 text-left font-medium">Next Due</th>
                        <th className="px-6 py-3 text-left font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map((payment, index) => (
                        <tr key={payment._id} className="text-sm">
                            <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{payment._id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{payment.userId._id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{payment.shopId._id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{payment.paymentType}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <img
                                src={payment.paymentPhoto}
                                alt="Payment"
                                className="w-10 h-10 object-cover rounded-md"
                            />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{payment.amount} Ks</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(payment.paidDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            {payment.nextPaymentDueDate ? new Date(payment.nextPaymentDueDate).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                                payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                payment.status === 'Finished' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {payment.status}
                            </span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>
            )}
            </div>
      </div>
    </div>
  );
};

export default AdminManagePayments;