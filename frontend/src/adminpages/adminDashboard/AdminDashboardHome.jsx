import React, { useEffect, useState } from "react";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import { FiUsers, FiFileText, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { FaUserShield } from "react-icons/fa";

const AdminDashboardHome = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [pendingPayment, setPendingPayments] = useState(0);
  const [overdueUsers, setOverdueUsers] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const userRes = await fetch("/api/users");
        const users = await userRes.json();
        setTotalUsers(users.length);

        const overdueRes = await fetch("/api/payments/user/overdue");
        const overdue = await overdueRes.json();
        setOverdueUsers(overdue.length);

        const adminRes = await fetch("/api/admins");
        const admins = await adminRes.json();
        setTotalAdmins(admins.length);

        const pendingRes = await fetch("/api/payments/pending");
        const pending = await pendingRes.json();
        setPendingPayments(pending.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <div className="flex-1 flex flex-col h-full w-4/5">
        <AdminDashboardHeader />
        {/* In the future Clicking these four */}
        <div className="p-6 space-y-6 bg-gray-50 min-h-full">
          {/* Welcome message */}
          <div>
            <h2 className="text-2xl font-bold text-teal-600">Welcome, Admin</h2>
            <p className="text-sm text-gray-600">Here’s a quick overview of township activity</p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
              <FiUsers className="text-2xl text-teal-600" />
              <div>
                <p className="text-lg font-bold">{totalUsers}</p>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
              <FaUserShield className="text-2xl text-teal-600" />
              <div>
                <p className="text-lg font-bold">{totalAdmins}</p>
                <p className="text-sm text-gray-500">Total Admins</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
              <FiCheckCircle className="text-2xl text-teal-600" />
              <div>
                <p className="text-lg font-bold">{pendingPayment}</p>
                <p className="text-sm text-gray-500">Pending Payment</p>
              </div>
            </div>

            <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
              <FiAlertCircle className="text-2xl text-teal-600" />
              <div>
                <p className="text-lg font-bold">{overdueUsers}</p>
                <p className="text-sm text-gray-500">Overdue Users</p>
              </div>
            </div>
          </div>

          {/* Regulation */}
          <div className="bg-white shadow rounded-xl p-6 mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Admin Regulation</h3>
            <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
              <li>All tax payments must be recorded before the 5th of every month.</li>
              <li>Shops must renew licenses annually with updated documents.</li>
              <li>Sanitation inspections occur every 2 weeks; maintain hygiene at all times.</li>
              <li>Unauthorized stalls will be removed after 3 warnings.</li>
              <li>Admins must update overdue user list weekly.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
