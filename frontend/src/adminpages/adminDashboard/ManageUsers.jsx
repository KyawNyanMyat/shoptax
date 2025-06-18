// pages/AdminManageUsers.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const fetchUsers = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/users"); 
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (

    <div className="flex min-h-screen">
        <AdminDashboardSidebar />
        <div className="flex-1 flex flex-col h-full w-4/5">
            <AdminDashboardHeader />

        {loading ? (
        <p>Loading Users...</p>
        ) : users.length == 0 ? (
        <p className="text-gray-500">No Users found.</p>
        ) : (

            <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-teal-600">Manage Users</h2>
                {/* <Link
                to="/admin/create-user"
                className="btn btn-sm bg-teal-600 text-white hover:bg-teal-700"
                >
                + Create User
                </Link> */}
            </div>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full text-sm">
                <thead className="bg-gray-200 text-gray-700">
                    <tr>
                    <th>No</th>
                    <th>UserID</th>
                    <th>Username</th>
                    <th>Password</th>
                    <th>NRC</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Shop</th>
                    <th>Photo</th>
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
                        <td>{u.shopId?.marketHallNo} / {u.shopId?.shopNo}</td>
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
