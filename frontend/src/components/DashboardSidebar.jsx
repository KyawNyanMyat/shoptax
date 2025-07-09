import { FiHome, FiUser, FiSettings } from "react-icons/fi";
import { RiFileList2Line } from "react-icons/ri";
import { CiLogout, CiShop } from "react-icons/ci";
import { IoReceiptOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import useLogout from "../hooks/useLogout";

const DashboardSidebar = () => {
  const { loading, logout } = useLogout()
  return (
    <aside className="bg-base-200 w-64 min-h-screen p-6 shadow-md">
      {/* ခေါင်းစဉ် / တံဆိပ် */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-primary">အသုံးပြုသူရဲ့ထိန်းချုပ်မှုများ</h2>
        <p className="text-sm text-gray-500">ပြန်လည်ကြိုဆိုပါတယ်!</p>
      </div>

      {/* ညွှန်ကြားမှု Link များ */}
      <nav className="flex flex-col gap-4 text-sm">
        <Link to="/user" className="flex items-center gap-3 hover:text-primary">
          <FiHome className="text-lg" />
          ဒက်ရှ်ဘုတ်
        </Link>
        <Link to="/user/warningmessage" className="flex items-center gap-3 hover:text-primary">
          <RiFileList2Line className="text-lg" />
          သတိပေးချက်များ
        </Link>
        <Link to="/user/paymentproof" className="flex items-center gap-3 hover:text-primary">
          <FiUser className="text-lg" />
          ငွေပေးချေမှုတင်သွင်းရန်
        </Link>
        <Link to="/user/receipt" className="flex items-center gap-3 hover:text-primary">
          <IoReceiptOutline className="text-lg" />
          ပြေစာများ
        </Link>
        <Link to="/user/viewshops" className="flex items-center gap-3 hover:text-primary">
          <CiShop className="text-lg" />
          ကိုယ်ပိုင်သောဆိုင်များ
        </Link>
        <Link
          to="#"
          onClick={logout}
          className="flex items-center gap-3 hover:text-primary"
        >
          <CiLogout className="text-lg" />
          {loading ? <span className="loading loading-spinner loading-sm"></span> : "ထွက်ခွာရန်"}
        </Link>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
