import { FiHome, FiUser, FiSettings } from "react-icons/fi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { CiShop } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { MdAdminPanelSettings, MdOutlineAdminPanelSettings } from "react-icons/md";

const AdminDashboardSidebar = () => {
  return (
    <aside className="bg-slate-800 text-white w-64 min-h-screen p-6 shadow-md">
      {/* Logo / Title */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white">TDD Admin Panel</h2>
        <p className="text-sm text-slate-400">Admin controls</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 text-sm">
        <Link to="/admin/dashboard" className="flex items-center gap-3 hover:text-slate-300">
          <FiHome className="text-lg" />
          Dashboard
        </Link>
        <Link to="/admin/manageuser" className="flex items-center gap-3 hover:text-slate-300">
          <FiUser className="text-lg" />
          Manage Users
        </Link>
        <Link to="/admin/manageadmin" className="flex items-center gap-3 hover:text-slate-300">
          <MdAdminPanelSettings className="text-lg" />
          Manage Admins
        </Link>
        <Link to="/admin/manageshop" className="flex items-center gap-3 hover:text-slate-300">
          <CiShop className="text-lg" />
          Manage Shop
        </Link>
        <Link to="/admin/managepayment" className="flex items-center gap-3 hover:text-slate-300">
          <RiSecurePaymentLine className="text-lg" />
          Manage Payment
        </Link>
        <Link to="/admin" className="flex items-center gap-3 hover:text-slate-300">
          <CiLogout className="text-lg" />
          Logout
        </Link>
      </nav>
    </aside>
  );
};

export default AdminDashboardSidebar;
