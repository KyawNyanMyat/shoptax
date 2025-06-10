import { FiHome, FiUser, FiSettings } from "react-icons/fi";
import { RiFileList2Line } from "react-icons/ri";
import { CiLogout } from "react-icons/ci";
import { IoReceiptOutline } from "react-icons/io5";
import { Link } from 'react-router-dom'

const DashboardSidebar = () => {
  return (
    <aside className="bg-base-200 w-64 min-h-screen p-6 shadow-md">
      {/* Logo / Title */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-primary">TDD Panel</h2>
        <p className="text-sm text-gray-500">Welcome back!</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 text-sm">
        <Link to="/user" className="flex items-center gap-3 hover:text-primary">
          <FiHome className="text-lg" />
          Dashboard
        </Link>
        <Link to="/user/warningmessage" className="flex items-center gap-3 hover:text-primary">
          <RiFileList2Line className="text-lg" />
          Warning Messages
        </Link>
        <Link to="/user/paymentproof" className="flex items-center gap-3 hover:text-primary">
          <FiUser className="text-lg" />
          Payment
        </Link>
        <Link to="/user/receipt" className="flex items-center gap-3 hover:text-primary">
          <IoReceiptOutline className="text-lg" />
          Receipts
        </Link>
        <Link to="/" className="flex items-center gap-3 hover:text-primary">
        <CiLogout className="text-lg" />
          Logout
        </Link>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
