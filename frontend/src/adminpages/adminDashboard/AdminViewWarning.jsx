import React, { useEffect, useState } from "react";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";

const AdminViewWarnings = () => {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWarnings = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/warnings");
        const data = await res.json();
        setWarnings(data);
      } catch (err) {
        console.error("Failed to load warnings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWarnings();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <div className="flex-1 h-full w-4/5">
        <AdminDashboardHeader />

        <div className="p-6 bg-gray-50">
          <h2 className="text-2xl font-bold text-teal-600 mb-6">All Warnings</h2>
          {loading ? (
            <p>Loading...</p>
          ) : warnings.length == 0 ? (
            <p>No warnings found.</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow">
              <table className="table w-full text-sm">
                <thead className="bg-teal-100 text-teal-800">
                  <tr>
                    <th>No</th>
                    <th>User</th>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Overdue Fee</th>
                    <th>Issue Date</th>
                    <th>Is Read</th>
                  </tr>
                </thead>
                <tbody>
                  {warnings.map((w, i) => (
                    <tr key={w._id}>
                      <td>{i + 1}</td>
                      <td>{w.userId?.username}</td>
                      <td>{w.warningTitle}</td>
                      <td>{w.warningContent}</td>
                      <td>{w.overdueFee} Ks</td>
                      <td>{new Date(w.issueDate).toLocaleDateString()}</td>
                      <td>{w.isRead ? "Yes" : "No"}</td>
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

export default AdminViewWarnings;
