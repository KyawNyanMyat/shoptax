import { useEffect, useState } from "react";
import { FiBell } from "react-icons/fi";
import { Navigate, useNavigate } from "react-router-dom";
import { useUserAuthContext } from "../context/userAuthContext";

const DashboardHeader = () => {
  const { userAuth, setUserAuth } = useUserAuthContext()
  if(!userAuth){
    return <Navigate to={"/"} />
  }

  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <header className="bg-primary text-white px-6 py-4 shadow flex justify-between items-center">
      {/* ဘယ်ဘက် - ခေါင်းစဉ် */}
      <div>
        <h1 className="text-xl font-bold">အသုံးပြုသူ စာမျက်နှာ</h1>
        <p className="text-sm text-gray-200">သင်၏ အကောင့်ကို စီမံခန့်ခွဲပါ</p>
      </div>

      {/* ညာဘက် - ကြားနာခေါင်းလောင်းနှင့် ပရိုဖိုင် */}
      <div className="flex items-center gap-6">

        {/* မြေပြင်စာမျက်နှာသို့ ပြန်သွားရန် ခလုတ် */}
        <button
          onClick={handleHomeClick}
          className="btn btn-sm btn-outline border-white text-white hover:bg-white hover:text-primary"
        >
          ပင်မစာမျက်နှာသို့ ပြန်သွားရန်
        </button>

        {/* အသုံးပြုသူပရိုဖိုင်အိုင်ကွန်အတွက် နေရာ */}
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img
            src={userAuth.profilePhoto}
            alt="အသုံးပြုသူ"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
