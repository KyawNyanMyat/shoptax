// pages/AdminManageUsers.jsx
import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import { useAdminAuthContext } from "../../context/adminAuthContext";
import toast from "react-hot-toast";

const AdminManageUsers = () => {
  const { adminAuth } = useAdminAuthContext();
  if (!adminAuth) {
    return <Navigate to={"/admin"} />;
  }

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "အသုံးပြုသူအချက်အလက်များကို ရယူရာတွင် ပြဿနာတစ်ခု ဖြစ်ပွားနေပါသည်။");
        }
        setUsers(data);
      } catch (error) {
        console.error("အသုံးပြုသူများကို မရယူနိုင်ပါ", error);
        toast.error(error.message, { id: "admin-user-error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <div className="flex-1 flex flex-col max-h-screen w-4/5">
        <AdminDashboardHeader />

        {loading ? (
          <p>အသုံးပြုသူများကို တင်ဆက်နေပါသည်...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">အသုံးပြုသူမတွေ့ပါ။</p>
        ) : (
          <div className="p-6 space-y-4 overflow-scroll">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-teal-600">အသုံးပြုသူများ စီမံခန့်ခွဲမှု</h2>
              <Link
                to="/admin/user/signup"
                className="btn btn-sm bg-teal-600 text-white hover:bg-teal-700 p-4"
              >
                + အသုံးပြုသူအကောင့်အသစ်ထည့်ရန်
              </Link>
            </div>

            <div className="">
              <table className="table table-zebra w-full text-sm">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th>စဉ်</th>
                    <th>အသုံးပြုသူ ID</th>
                    <th>အမည်</th>
                    <th>စကားဝှက်</th>
                    <th>မှတ်ပုံတင်</th>
                    <th>ဖုန်းနံပါတ်</th>
                    <th>ကျား/မ</th>
                    <th>ဓာတ်ပုံ</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, idx) => (
                    <tr key={u._id}>
                      <td>{idx + 1}</td>
                      <td>{u._id}</td>
                      <td>{u.username}</td>
                      <td>{u.password}</td>
                      <td>{u.NRC}</td>
                      <td>{u.phoneNo}</td>
                      <td className="capitalize">{u.gender}</td>
                      <td>
                        <img
                          src={u.profilePhoto}
                          alt="Profile"
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageUsers;
