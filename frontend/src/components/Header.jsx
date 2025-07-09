import { FiMenu } from "react-icons/fi";
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import { LuCircleUserRound } from "react-icons/lu";
import { useUserAuthContext } from "../context/userAuthContext";
import toast from "react-hot-toast";
import { useState } from "react";

const Header = () => {
  const { userAuth } = useUserAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (!userAuth) {
      toast.error("အကောင့်အရင်ဝင်ရန်", { id: "home-error", duration: 2500 });
    } else {
      navigate("/user");
    }
  };

  const toDashboard = (e) => {
    e.preventDefault();
    if (!userAuth) {
      navigate("/login");
    } else {
      navigate("/user");
    }
  };

  return (
    <header className="relative bg-indigo-900 text-white px-4 py-3 shadow flex justify-between items-center top-0 z-50 sm:static">
      {/* Logo & Title */}
      <div className="flex items-center gap-4 h-30">
        <img src={logo} alt="Logo" className="w-20 h-24 object-cover" />
        <div>
          <h1 className="text-xl font-bold w-60 not-sm:w-40 sm:text-2xl">
            ဈေးနှင့်သားသတ်ဌာနစိတ်
          </h1>
          <p className="text-sm text-gray-200 hidden sm:block">
            ပြည်သူ့အတွက် သတ္တိဖြင့်ဝန်ဆောင်မှုပေးနေသည်
          </p>
        </div>
      </div>

      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center gap-6">
        <Link to="/" className="hover:underline">ပင်မစာမျက်နှာ</Link>
        <Link to="/about" className="hover:underline">အကြောင်းအရာ</Link>
        <Link to="/contact" className="hover:underline">ဆက်သွယ်ရန်</Link>
        <button className="btn btn-sm btn-success text-gray-900" onClick={toDashboard}>
          {userAuth ? "အသုံးပြုသူစာမျက်နှာသို့သွားပါ" : "အကောင့်ဝင်ရန်"}
        </button>

        {/* User Icon */}
        <div className="cursor-pointer" onClick={handleClick}>
          {userAuth?.profilePhoto ? (
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img
                src={userAuth.profilePhoto}
                alt="အသုံးပြုသူ"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <LuCircleUserRound className="text-white text-3xl" />
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button onClick={() => setIsOpen(true)}>
          <FiMenu className="text-3xl cursor-pointer" />
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Sidebar From Right */}
          <div className="lg:hidden fixed top-0 right-0 h-full w-1/2 bg-white text-gray-800 z-50 shadow-md p-6 space-y-6 transition-all duration-300 ease-in-out">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-indigo-900">Menu</h2>
              <IoMdClose
                className="text-3xl cursor-pointer"
                onClick={() => setIsOpen(false)}
              />
            </div>

            {/* User Info */}
            <div className="flex justify-center" onClick={handleClick}>
              {userAuth?.profilePhoto ? (
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={userAuth.profilePhoto}
                    alt="အသုံးပြုသူ"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <LuCircleUserRound className="text-3xl text-indigo-900" />
              )}
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-4">
              <Link to="/" onClick={() => setIsOpen(false)}>ပင်မစာမျက်နှာ</Link>
              <Link to="/about" onClick={() => setIsOpen(false)}>အကြောင်းအရာ</Link>
              <Link to="/contact" onClick={() => setIsOpen(false)}>ဆက်သွယ်ရန်</Link>
              <button
                className="btn btn-sm btn-success"
                onClick={(e) => {
                  toDashboard(e);
                  setIsOpen(false);
                }}
              >
                {userAuth ? "အသုံးပြုသူစာမျက်နှာသို့သွားပါ" : "အကောင့်ဝင်ရန်"}
              </button>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
