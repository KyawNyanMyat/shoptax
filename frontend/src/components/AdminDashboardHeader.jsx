import { FiBell } from "react-icons/fi";

const AdminDashboardHeader = () => {
  return (
    <header className="bg-teal-700 text-white px-6 py-4 shadow flex justify-between items-center">
      {/* Left - Title */}
      <div>
        <h1 className="text-xl font-bold">TDD Admin Dashboard</h1>
        <p className="text-sm text-amber-100">Oversee and manage township operations</p>
      </div>

      {/* Right - Bell & Profile */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <div className="relative cursor-pointer">
          <FiBell className="text-white text-2xl" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
        </div>

        {/* Admin profile icon */}
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-amber-700 font-bold">
          A
        </div>
      </div>
    </header>
  );
};

export default AdminDashboardHeader;
