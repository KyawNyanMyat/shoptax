import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import useAdminSignup from "../../hooks/useAdminSignup"; 
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAdminAuthContext } from "../../context/adminAuthContext";

const AdminSignup = () => {
  const { adminAuth } = useAdminAuthContext()
  if (!adminAuth) {
    return <Navigate to={"/admin"} />
  }
  const { adminSignup, loading } = useAdminSignup();
  const [formData, setFormData] = useState({
    adminName: "",
    adminPassword: "",
    phoneNo: "",
    position: "",
    section: "စျေးနှင့်သားသတ်ဌာနစိတ်",
  });
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await adminSignup(formData);

    if(success)
    {
      setFormData({
        adminName: "",
        adminPassword: "",
        phoneNo: "",
        position: "",
        section: "စျေးနှင့်သားသတ်ဌာနစိတ်",
      })
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 w-11/12 md:w-1/3 shadow-lg rounded-lg border-t-4 border-blue-600">
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <FaUserShield className="text-blue-600 text-2xl" />
            </div>
              <h1 className="text-2xl font-bold text-gray-800">အုပ်ချုပ်ရေးအကောင့်ဖွင့်ခြင်း</h1>
              <p className="text-sm text-gray-600 mt-2">ခွင့်ပြုထားသူများအတွက်သာ အသုံးပြုနိုင်ပါသည်</p>
            </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">နာမည်</label>
              <input
                type="text"
                autoComplete="off"
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
                placeholder="ဦးကျော်လင်း"
                className="w-full input input-bordered focus:outline-offset-0"
                required
              />
            </div>

            <div className="relative">
              <label className="block font-medium text-gray-700 mb-1">လျို့၀ှက်နံပါတ်</label>
              <input
                type={showPassword ? "text" : "password"}
                name="adminPassword"
                autoComplete="new-password"
                value={formData.adminPassword}
                onChange={handleChange}
                placeholder="ဥပမာ.၁၂၃၄fpass"
                className="w-full input input-bordered focus:outline-offset-0 pr-10"
                required
              />
               <span
                  className="absolute right-3 top-10 z-10 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEye className="text-xl" /> : <FiEyeOff className="text-xl" />}
                </span>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">ဖုန်းနံပါတ်</label>
              <input
                type="text"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                placeholder="09-988657844"
                className="w-full input input-bordered focus:outline-offset-0"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                ငှာနစိတ်
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full select select-bordered focus:outline-offset-0"
                required
              >
                <option value="စျေးနှင့်သားသတ်ဌာနစိတ်">
                  စျေးနှင့်သားသတ်ဌာနစိတ်
                </option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                ရာထူး
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full select select-bordered focus:outline-offset-0"
                required
              >
                <option value="" disabled>
                ရာထူး ရွေးရန်
                </option>
                <option value="ဒုဦးစီးမှူး">
                  ဒုဦးစီးမှူး
                </option>
                <option value="အကြီးတန်းစာရေး">
                  အကြီးတန်းစာရေး
                </option>
                {/* In the future delete or just leave as it */}
                <option value="အငယ်တန်းလက်နှိပ်စက်">
                  အငယ်တန်းလက်နှိပ်စက်
                </option>
                <option value="စက်မောင်းလေး">
                  စက်မောင်းလေး
                </option>
                <option value="အခွန်ကောက်">
                အခွန်ကောက်
                </option>
                <option value="လုပ်သားသုံး">
                လုပ်သားသုံး
                </option>
                <option value="နေ့ရှင်း">
                နေ့ရှင်း
                </option>
              </select>
            </div>
          </div>


          {/* Buttons */}
          <div className="pt-6 space-y-3">
            <button
              type="submit"
              className="btn w-full bg-blue-600 hover:bg-blue-700 border-none text-white focus:outline-offset-0"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "အကောင့်ဖွင့်ရန်"}
            </button>

            <Link
              to="/admin/dashboard"
              className="block text-center text-sm hover:underline hover:text-blue-600 text-green-600"
            >
              အုပ်ချုပ်သူ ဘုတ်ပြားဆီသွားရန်
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
