import { FiBell } from "react-icons/fi";
import { Navigate } from "react-router-dom";
import { useAdminAuthContext } from "../context/adminAuthContext";

const AdminDashboardHeader = ({ setSidebarOpen }) => {
  const { adminAuth } = useAdminAuthContext()
  if (!adminAuth) {
    return <Navigate to={"/admin"} />
  }
  let userPhoto = adminAuth.profilePhoto;
  return (
    <header className="bg-teal-700 text-white px-6 py-4 shadow flex justify-between items-center">
      <button
        onClick={() => setSidebarOpen(true)}
        className="btn btn-sm lg:hidden mr-4"
      >
        ☰
      </button>
      <div>
        <h1 className="text-xl font-bold">အုပ်ချုပ်ရေး ဒက်ရှ်ဘုတ်</h1>
        <p className="text-sm text-amber-100">အသုံးပြုသူများနှင့် ဈေးကွက်စီမံခန့်ခွဲမှုများကို ကြီးကြပ်ခြင်း</p>
      </div>

      <div className="sm:flex hidden items-center gap-6">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          {userPhoto && (
            <img
              src={userPhoto}
              alt="အုပ်ချုပ်ရေးဝင်"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminDashboardHeader;
