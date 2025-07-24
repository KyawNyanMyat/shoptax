import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAdminAuthContext } from "../../context/adminAuthContext";
import useCreateShop from "../../hooks/useCreateShop";

const AdminCreateShop = () => {
    const { adminAuth } = useAdminAuthContext();
    if (!adminAuth) {
      return <Navigate to={"/admin"} />;
    }
  const [formData, setFormData] = useState({
    marketHallNo: "",
    shopNo: "",
    chargeRate: "",
  });

  const { loading, createShop } = useCreateShop()
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await createShop(formData)
    if (success) {
        setFormData({
            marketHallNo: "",
            shopNo: "",
            chargeRate: "",
        });
      }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border-t-4 border-teal-600">
        <h2 className="text-2xl font-bold text-teal-700 mb-4 text-center">
          ဆိုင်အသစ် ထည့်ရန်
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block mb-1 font-medium text-gray-700">ဈေးရုံနံပါတ်</label>
            <input
              type="text"
              name="marketHallNo"
              value={formData.marketHallNo}
              onChange={handleChange}
              placeholder="ဥပမာ - A1"
              className="input input-bordered w-full focus:outline-offset-0"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">ဆိုင်နံပါတ်</label>
            <input
              type="text"
              name="shopNo"
              value={formData.shopNo}
              onChange={handleChange}
              placeholder="ဥပမာ - 12"
              className="input input-bordered w-full focus:outline-offset-0"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">အခွန်နှုန်း</label>
            <input
                type="text"
                name="chargeRate"
                value={formData.chargeRate}
                onChange={(e) => {
                    const value = e.target.value;
                    const pattern = /^(0|[1-9][0-9]*)?$/; // Allows empty string or positive numbers without leading zero
                    if (pattern.test(value)) {
                    setFormData({ ...formData, [e.target.name]: value });
                    }
                }}
                placeholder="ဥပမာ - 5000"
                className="input input-bordered w-full focus:outline-offset-0"
                required
            />
          </div>

          <Link to='/admin/dashboard' className='text-sm hover:underline text-green-600 hover:text-blue-700 inline-block'>ဈေးတာ၀န်ခံဒက်ရှ်ဘုတ် သို့သွားရန်</Link>
          <button
            type="submit"
            className="btn w-full bg-teal-600 hover:bg-teal-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "ထည့်သွင်းရန်"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateShop;
