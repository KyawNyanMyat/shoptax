import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserShield } from "react-icons/fa";
import useAdminSignup from "../../hooks/useAdminSignup"; 

const AdminSignup = () => {
  const { adminSignup, loading } = useAdminSignup();
  const [formData, setFormData] = useState({
    adminName: "",
    adminPassword: "",
    phoneNo: "",
    division: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.division) {
      return alert("Please select a division");
    }
    adminSignup(formData);
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
            <h1 className="text-2xl font-bold text-gray-800">Admin Registration</h1>
            <p className="text-sm text-gray-600">Restricted to authorized personnel only</p>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">UserName</label>
              <input
                type="text"
                autoComplete="off"
                name="adminName"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full input input-bordered focus:outline-offset-0"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="adminPassword"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full input input-bordered focus:outline-offset-0"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">Phone no</label>
              <input
                type="text"
                name="phoneNo"
                value={formData.phone}
                onChange={handleChange}
                placeholder="09974337432"
                className="w-full input input-bordered focus:outline-offset-0"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Divisions of Department of Markets and Slaughterhouses, Taxation, and Sanitation
              </label>
              <select
                name="division"
                value={formData.division}
                onChange={handleChange}
                className="w-full select select-bordered focus:outline-offset-0"
                required
              >
                <option value="" disabled>
                  Select division
                </option>
                <option value="Market Regulation and Slaughterhouse Management Division">
                  Market Regulation and Slaughterhouse Management Division
                </option>
                <option value="Taxation Division">Taxation Division</option>
                <option value="Sanitation and Waste Management Division">
                  Sanitation and Waste Management Division
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
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Register Admin Account"}
            </button>
            <Link
              to="/admin"
              className="block text-center text-sm hover:underline hover:text-blue-600 text-gray-600"
            >
              Already have admin access? Login here
            </Link>

            <Link
              to="/admin/dashboard"
              className="block text-center text-sm hover:underline hover:text-blue-600 text-green-600"
            >
              Go To Admin Dashboard
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
