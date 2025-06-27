import { FiBell } from "react-icons/fi";
import { Link, Navigate, useNavigate } from "react-router-dom";
import logo from "../assets/react.svg";
import { LuCircleUserRound } from "react-icons/lu";
import { useUserAuthContext } from "../context/userAuthContext";
import toast from "react-hot-toast";

const Header = () => {
  const { userAuth, setUserAuth } = useUserAuthContext()
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if(!userAuth){
      toast.error("အကောင့်အရင်ဝင်ရန်", {id: "home-error", duration: 2500})
    }
    else{
      navigate("/user");
    }
  };


  return (
    <header className="bg-primary text-white px-8 py-4 shadow flex justify-between items-center">
      {/* Logo & Title */}
      <div className="flex items-center gap-4">
        <img
          src={logo} // အမှန်တကယ်သုံးမည့် logo path ဖြင့်ပြောင်းပါ
          alt="TDD Logo"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">စည်ပင်သာယာရေး၀န်ကြီးဌာန</h1>
          <p className="text-sm text-gray-200">ပြည်သူ့အတွက် သတ္တိဖြင့်ဝန်ဆောင်မှုပေးနေသည်</p>
        </div>
      </div>

      {/* Nav + Bell */}
      <div className="flex items-center gap-6">
        <Link to='/' className="hover:underline">ပင်မစာမျက်နှာ</Link>
        <Link to='/about' className="hover:underline">အကြောင်းအရာ</Link>
        <Link to='/contact' className="hover:underline">ဆက်သွယ်ရန်</Link>
        <Link to='/login' className="btn btn-sm btn-accent text-white">အကောင့်ဝင်ရန်</Link>

        {/* User Icon */}
        <div className="cursor-pointer" onClick={handleClick}>
            { userAuth?.profilePhoto ? (
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
    </header>
  );
};

export default Header;
