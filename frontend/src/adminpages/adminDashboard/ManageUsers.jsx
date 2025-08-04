// pages/AdminManageUsers.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import { useAdminAuthContext } from "../../context/adminAuthContext";
import toast from "react-hot-toast";
import { useSocketContext } from "../../context/socketContext";

const AdminManageUsers = () => {
  const { adminAuth } = useAdminAuthContext();
  if (!adminAuth) {
    return <Navigate to={"/admin"} />;
  }

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const socket = useSocketContext()
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchUsers = async (search = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users?search=${encodeURIComponent(search)}`);
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

  useEffect(() => {
    fetchUsers();
  }, []);


  useEffect(() => {

    if(!socket) return;

    const handleNewUserCreated =  (userObj)=>{
      setUsers((prev) => [...prev, userObj])
    }

    const handleNewPassword = (newpassword) =>{
      setUsers((prev)=>
        prev.map((u)=> u._id === newpassword._id ? newpassword : u)
      )
    }

    socket.on("newUserCreated", handleNewUserCreated)
    socket.on("changedPassword", handleNewPassword)

    return ()=> {
      socket.off("newUserCreated", handleNewUserCreated)
      socket.off("changedPassword", handleNewPassword)
    }
  }, [socket]);

  return (
    <div className="flex max-h-screen">
      <AdminDashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminDashboardHeader setSidebarOpen={setSidebarOpen}/>
        
          <div className="p-6 h-screen overflow-y-auto">
              <div className="flex justify-between items-center flex-wrap mt-3 mb-3">
                <h2 className="text-2xl font-bold text-teal-600">အသုံးပြုသူများ စီမံခန့်ခွဲမှု</h2>
                <Link
                  to="/admin/user/signup"
                  className="btn btn-sm bg-teal-600 text-white hover:bg-teal-700 p-4"
                >
                  + အသုံးပြုသူအကောင့်အသစ်ထည့်ရန်
                </Link>
              </div>
            {loading ? (
            <p>အသုံးပြုသူများကို တင်ဆက်နေပါသည်...</p>
              ) : users.length === 0 ? (
                <p className="text-gray-500">အသုံးပြုသူမတွေ့ပါ။</p>
              ) : (
            <div>
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
                    onClick={() => fetchUsers(searchTerm)} // we'll update fetchUsers soon
                  >
                    ရှာဖွေရန်
                  </button>
                </div>

                <div className="p-2 overflow-x-auto">
                  <table className="table table-zebra min-w-[700px] w-full text-sm">
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
                          <td className="capitalize">{u.gender =="Male" ? "ယောင်္ကျား": "မိန်းမ"}</td>
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
    </div>
  );
};

export default AdminManageUsers;
