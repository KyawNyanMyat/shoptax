import { FiHome, FiUser } from "react-icons/fi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { CiLogout, CiShop } from "react-icons/ci";
import { MdAdminPanelSettings } from "react-icons/md";
import { IoReceiptOutline, IoWarningOutline } from "react-icons/io5";
import { PiShieldWarning } from "react-icons/pi";
import { Link } from 'react-router-dom';
import useAdminLogout from "../hooks/useAdminLogout";

const AdminDashboardSidebar = () => {
  const { loading, logout } = useAdminLogout();
  return (
    <aside className="bg-slate-800 text-white w-64 min-h-screen p-6 shadow-md">
      {/* ခေါင်းစဉ် / Panel Name */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white">အုပ်ချုပ်ရေးဘုတ်ပြား</h2>
        <p className="text-sm text-slate-400">အုပ်ချုပ်သူများအတွက် ထိန်းချုပ်မှုများ</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 text-sm">
        <Link to="/admin/dashboard" className="flex items-center gap-3 hover:text-slate-300">
          <FiHome className="text-lg" />
          ပင်မဒက်ရှ်ဘုတ်
        </Link>

        <Link to="/admin/manageuser" className="flex items-center gap-3 hover:text-slate-300">
          <FiUser className="text-lg" />
          အသုံးပြုသူများကို စီမံရန်
        </Link>

        <Link to="/admin/manageadmin" className="flex items-center gap-3 hover:text-slate-300">
          <MdAdminPanelSettings className="text-lg" />
          အုပ်ချုပ်သူများကို စီမံရန်
        </Link>

        <Link to="/admin/manageshop" className="flex items-center gap-3 hover:text-slate-300">
          <CiShop className="text-lg" />
          ဆိုင်များကို စီမံရန်
        </Link>

        <Link to="/admin/managepayment" className="flex items-center gap-3 hover:text-slate-300">
          <RiSecurePaymentLine className="text-lg" />
          ငွေပေးချေမှုများကို စီမံရန်
        </Link>

        <Link to="/admin/sendwarning" className="flex items-center gap-3 hover:text-slate-300">
          <PiShieldWarning className="text-lg" />
          သတိပေးချက် ပေးရန်
        </Link>

        <Link to="/admin/viewreceipt" className="flex items-center gap-3 hover:text-slate-300">
          <IoReceiptOutline className="text-lg" />
          ပြေစာအားလုံး ကြည့်ရန်
        </Link>

        <Link to="/admin/viewwarning" className="flex items-center gap-3 hover:text-slate-300">
          <IoWarningOutline className="text-lg" />
          သတိပေးချက်အားလုံး ကြည့်ရန်
        </Link>

        <Link
          to="/admin"
          onClick={logout}
          className="flex items-center gap-3 hover:text-slate-300"
        >
          <CiLogout className="text-lg" />
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "ထွက်ခွာရန်"
          )}
        </Link>
      </nav>
    </aside>
  );
};

export default AdminDashboardSidebar;
