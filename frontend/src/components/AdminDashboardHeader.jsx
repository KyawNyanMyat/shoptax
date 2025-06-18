import { FiBell } from "react-icons/fi";

const AdminDashboardHeader = () => {
  let userPhoto = "https://avatar.iran.liara.run/username?username=Kyaw" // in the future
  return (
    <header className="bg-teal-700 text-white px-6 py-4 shadow flex justify-between items-center">
      {/* Left - Title */}
      <div>
        <h1 className="text-xl font-bold">TDD Admin Dashboard</h1>
        <p className="text-sm text-amber-100">Oversee haah and manage township operations</p>
      </div>

      {/* Right - Bell & Profile */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        {/* <div className="relative cursor-pointer">
          <FiBell className="text-white text-2xl" />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
        </div> */}

        {/* Admin profile icon */}
        <div className="w-8 h-8 rounded-full overflow-hidden">
          {userPhoto && (
            <img
              src={userPhoto}
              alt="User"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminDashboardHeader;
