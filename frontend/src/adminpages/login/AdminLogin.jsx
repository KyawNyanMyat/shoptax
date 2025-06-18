import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';
import useAdminLogin from '../../hooks/useAdminLogin';

const AdminLogin = () => {
  const { adminLogin, loading } = useAdminLogin();

  const [formData, setFormData] = useState({
    adminName: '',
    adminPassword: '',
    division: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.division) return alert('Please select a division');
    adminLogin(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 w-11/12 md:w-1/3 shadow-lg rounded-lg border-t-4 border-blue-600">
        <form onSubmit={handleSubmit} autoComplete="off">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <FaShieldAlt className="text-blue-600 text-2xl" />
            <span className="text-3xl font-semibold text-gray-800">Admin Login</span>
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block font-semibold py-2 text-gray-700">Admin ID</label>
            <input
              type="text"
              name="adminName"
              value={formData.adminName}
              onChange={handleChange}
              placeholder="Enter admin username"
              className="w-full input input-bordered focus:outline-blue-500 focus:outline-offset-0"
              autoComplete="off"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block font-semibold py-2 text-gray-700">Password</label>
            <input
              type="password"
              name="adminPassword"
              value={formData.adminPassword}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full input input-bordered focus:outline-blue-500 focus:outline-offset-0"
              autoComplete="new-password"
              required
            />
          </div>

          {/* Division */}
          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-1">Division</label>
            <select
              name="division"
              value={formData.division}
              onChange={handleChange}
              className="w-full select select-bordered focus:outline-offset-0"
              required
            >
              <option value="" disabled>Select division</option>
              <option value="Market Regulation and Slaughterhouse Management Division">
                Market Regulation and Slaughterhouse Management Division
              </option>
              <option value="Taxation Division">Taxation Division</option>
              <option value="Sanitation and Waste Management Division">
                Sanitation and Waste Management Division
              </option>
            </select>
          </div>

          {/* Login Button */}
          <div className="pt-5">
            <button
              type="submit"
              className="btn w-full bg-blue-600 hover:bg-blue-700 border-none text-white"
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
