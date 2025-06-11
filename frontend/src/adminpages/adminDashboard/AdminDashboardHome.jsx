import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import { FiUsers, FiFileText, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";

const AdminDashboardHome = () => {
  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <div className="flex-1 flex flex-col">
        <AdminDashboardHeader />

        {/* Dashboard home */}
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
                <p className="text-lg font-bold">123</p>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
            </div>
            <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
              <IoWalletOutline className="text-2xl text-teal-600" />
              <div>
                <p className="text-lg font-bold">Ks 4,550,000</p>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </div>
            </div>
            <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
              <FiCheckCircle className="text-2xl text-teal-600" />
              <div>
                <p className="text-lg font-bold">18</p>
                <p className="text-sm text-gray-500">Pending Reviews</p>
              </div>
            </div>
            <div className="bg-white shadow rounded-xl p-4 flex items-center gap-4">
              <FiAlertCircle className="text-2xl text-teal-600" />
              <div>
                <p className="text-lg font-bold">5</p>
                <p className="text-sm text-gray-500">Total Warnings Sent</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white shadow rounded-xl p-6 mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Activity</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>✅ Payment received from user id oi0203r039 (Ks 35,00)</li>
              <li>⚠️ Warning sent to user 7898huehfe for overdue tax</li>
              <li>📝 New user registered: U089</li>
              {/* Add dynamic entries later */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
