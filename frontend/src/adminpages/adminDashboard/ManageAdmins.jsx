import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import { LiaUserPlusSolid } from "react-icons/lia";
import toast from "react-hot-toast";
import { useAdminAuthContext } from "../../context/adminAuthContext";
import { useSocketContext } from "../../context/socketContext";

const ManageAdmins = () => {
  const { adminAuth } = useAdminAuthContext();
  if (!adminAuth) {
    return <Navigate to={"/admin"} />;
  }

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("");
  const socket = useSocketContext()
  const myposition = "ဒုဦးစီးမှူး"

  const fetchAdmins = async (search="") => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admins?search=${encodeURIComponent(search)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "အုပ်ချုပ်သူ အချက်အလက်များ ရယူရာတွင် ပြဿနာ တစ်ခု ဖြစ်ပွားနေပါသည်။");
      }

      setAdmins(data);
    } catch (err) {
      console.error("အုပ်ချုပ်သူများကို မရယူနိုင်ပါ:", err);
      toast.error(err.message, { id: "admin-admin-error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchAdmins();
  }, [])

  useEffect(() => {

    if(!socket) return;

    const handleNewAdminCreated = (adminObj)=>{
      setAdmins((prev) => [...prev, adminObj])
    }

    socket.on("newAdminCreated", handleNewAdminCreated)

    return ()=> {
      socket.off("newAdminCreated", handleNewAdminCreated)
    }
  }, [socket]);

  const handleAuthorization = (e) => {
    if (myposition !== "ဒုဦးစီးမှူး") {
      toast.error("ခွင့်ပြုချက် မရှိပါ", { duration: 1500 });
    } else {
      navigate("/admin/signup");
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <div className="flex-1 flex flex-col max-h-screen w-4/5">
        <AdminDashboardHeader />

        <div className="p-6 bg-gray-50 overflow-scroll">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="အမည်ဖြင့် ရှာဖွေရန်..."
                className="input input-bordered w-full max-w-xs focus:outline-offset-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={() => fetchAdmins(searchTerm)} // we'll update fetchUsers soon
              >
                ရှာဖွေရန်
              </button>
            </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-teal-600">အုပ်ချုပ်သူ စီမံခန့်ခွဲမှု</h2>
            <button
              onClick={handleAuthorization}
              className="btn bg-blue-600 text-white hover:bg-blue-700"
            >
              <LiaUserPlusSolid className="text-2xl" />
              အုပ်ချုပ်သူ အသစ်ဖန်တီးရန်
            </button>
          </div>

          {loading ? (
            <p>အုပ်ချုပ်သူများကို တင်ဆက်နေပါသည်...</p>
          ) : admins.length === 0 ? (
            <p className="text-gray-500">အုပ်ချုပ်သူ မရှိသေးပါ။</p>
          ) : (
            <div className="">
              <table className="table w-full bg-white shadow rounded-xl">
                <thead>
                  <tr className="bg-blue-100 text-blue-800 text-sm">
                    <th>စဉ်</th>
                    <th>အုပ်ချုပ်သူ ID</th>
                    <th>အမည်</th>
                    <th>စကားဝှက်</th>
                    <th>ဖုန်း</th>
                    <th>ဌာနခွဲ</th>
                    <th>ရာထူး</th>
                    <th>ဓာတ်ပုံ</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, index) => (
                    <tr key={admin._id} className="text-sm">
                      <td>{index + 1}</td>
                      <td>{admin._id}</td>
                      <td>{admin.adminName}</td>
                      <td>{admin.adminPassword}</td>
                      <td>{admin.phoneNo}</td>
                      <td>{admin.section}</td>
                      <td>{admin.position}</td>
                      <td>
                        <img
                          src={admin.profilePhoto}
                          alt="ဓာတ်ပုံ"
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageAdmins;
