import { FiHome, FiUser, FiSettings } from "react-icons/fi";
import { RiFileList2Line } from "react-icons/ri";
import { CiLogout, CiShop } from "react-icons/ci";
import { IoReceiptOutline } from "react-icons/io5";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import useLogout from "../hooks/useLogout";
import { useUserAuthContext } from "../context/userAuthContext";
import { useSocketContext } from "../context/socketContext";

const DashboardSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { userAuth, setUserAuth } = useUserAuthContext()
  const socket = useSocketContext()
  if(!userAuth){
    return <Navigate to={"/"} />
  }
  const { loading, logout } = useLogout()

  const navigate = useNavigate()

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleLogout = async ()=>{
    if(!socket) return;

    socket.emit("leaveroom",userAuth._id)
    await logout()
  }
  return (
    <>
    <aside className="hidden lg:block bg-base-200 w-64 p-6 shadow-md h-screen overflow-x-auto overflow-y-auto">
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
          // to="#"
          onClick={handleLogout}
          className="flex items-center gap-3 hover:text-primary"
        >
          <CiLogout className="text-lg" />
          {loading ? <span className="loading loading-spinner loading-sm"></span> : "ထွက်ခွာရန်"}
        </Link>
      </nav>
    </aside>

    {sidebarOpen && (
        <div className="fixed max-h-screen inset-0 z-50 flex lg:hidden">
          <div className="w-64 bg-base-200 p-6 shadow-md overflow-x-auto overflow-y-auto">
            <button
              className="btn btn-sm mb-4"
              onClick={() => setSidebarOpen(false)}
            >
              ✕ ပိတ်ရန်
            </button>
            <div className="flex flex-col-reverse items-center py-4 gap-4">
              <button
                onClick={handleHomeClick}
                className="btn btn-sm btn-outline border-white text-black hover:text-primary"
              >
                ပင်မစာမျက်နှာသို့ ပြန်သွားရန်
              </button>

              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img
                  src={userAuth.profilePhoto}
                  alt="အသုံးပြုသူ"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
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
                // to="#"
                onClick={handleLogout}
                className="flex items-center gap-3 hover:text-primary"
              >
                <CiLogout className="text-lg" />
                {loading ? <span className="loading loading-spinner loading-sm"></span> : "ထွက်ခွာရန်"}
              </Link>
            </nav>
          </div>
          <div
            className="flex-1 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default DashboardSidebar;
