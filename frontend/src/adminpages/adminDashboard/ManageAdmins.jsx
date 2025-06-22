import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import { LiaUserPlusSolid } from "react-icons/lia";

const ManageAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/admins");
        const data = await res.json();
        setAdmins(data);
      } catch (err) {
        console.error("Failed to fetch admins:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <div className="flex-1 flex flex-col h-full w-4/5">
        <AdminDashboardHeader />

        <div className="p-6 bg-gray-50 min-h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-teal-600">Manage Admins</h2>
            <Link
              to="/admin/signup"
              className="btn bg-blue-600 text-white hover:bg-blue-700"
            >
              <LiaUserPlusSolid className="text-2xl"/>Create Admin
            </Link>
          </div>

          {loading ? (
            <p>Loading admins...</p>
          ) : admins.length === 0 ? (
            <p className="text-gray-500">No admins found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full bg-white shadow rounded-xl">
                <thead>
                  <tr className="bg-blue-100 text-blue-800 text-sm">
                    <th>No</th>
                    <th>AdminId</th>
                    <th>Name</th>
                    <th>Password</th>
                    <th>Phone</th>
                    <th>Division</th>
                    <th>Position</th>
                    <th>Photo</th>
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
                      <td>{admin.division}</td>
                      <td>{admin.position}</td>
                      <td>
                        <img
                            src={admin.profilePhoto}
                            alt="Profile"
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
