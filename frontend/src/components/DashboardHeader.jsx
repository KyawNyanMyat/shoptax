import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";

const DashboardHeader = () => {
  let userPhoto = "haha" // in the future
  return (
    <header className="bg-primary text-white px-6 py-4 shadow flex justify-between items-center">
      {/* Left - Title */}
      <div>
        <h1 className="text-xl font-bold">User Dashboard</h1>
        <p className="text-sm text-gray-200">Manage your own account</p>
      </div>

      {/* Right - Bell & Profile */}
      <div className="flex items-center gap-6">

        {/* Placeholder for user profile icon or dropdown */}
        <div className="w-8 h-8 rounded-full overflow-hidden">
          {userPhoto && (
            <img
              src={"#"}
              alt="User"
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
