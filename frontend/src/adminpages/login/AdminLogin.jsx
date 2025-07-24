import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import { FiEye, FiEyeOff } from "react-icons/fi";
import useAdminLogin from '../../hooks/useAdminLogin';

const AdminLogin = () => {
  const { adminLogin, loading } = useAdminLogin();

  const [formData, setFormData] = useState({
    adminName: '',
    adminPassword: '',
    position: ''
  });
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminLogin(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 w-11/12 md:w-1/3 shadow-lg rounded-lg border-t-4 border-blue-600">
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <FaShieldAlt className="text-blue-600 text-2xl" />
            <span className="text-3xl font-semibold text-gray-800">ဈေးတာ၀န်ခံ ဝင်ရောက်ခြင်း</span>
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block font-semibold py-2 text-gray-700">နာမည်</label>
            <input
              type="text"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              placeholder="အမည် ထည့်ပါ"
              className="w-full input input-bordered focus:outline-blue-500 focus:outline-offset-0"
              autoComplete="off"
              maxLength={50}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block font-semibold py-2 text-gray-700">စကားဝှက်</label>
            <input
              type={showPassword ? "text" : "password"}
              name="adminPassword"
              value={formData.adminPassword}
              onChange={handleChange}
              placeholder="စကားဝှက် ထည့်ပါ"
              className="w-full input input-bordered focus:outline-blue-500 focus:outline-offset-0 pr-10"
              autoComplete="new-password"
              maxLength={30}
              required
            />
            <span
              className="absolute right-3 top-13 z-10 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEye className="text-xl" /> : <FiEyeOff className="text-xl" />}
            </span>
          </div>

          {/* Division */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">ရာထူး</label>
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
              {/* delete or just leave as it */}
              {/* <option value="အငယ်တန်းလက်နှိပ်စက်">
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
              </option> */}
            </select>
          </div>

          {/* Login Button */}
          <div className="pt-5">
            <button
              type="submit"
              className="btn w-full bg-blue-600 hover:bg-blue-700 border-none text-white"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                'ဝင်မည်'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
