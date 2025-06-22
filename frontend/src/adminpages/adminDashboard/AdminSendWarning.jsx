import React, { useState, useEffect } from "react";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import useSendWarning from "../../hooks/useSendWarning";

const AdminSendWarning = () => {
  const [form, setForm] = useState({
    warningTitle: "",
    warningContent: "",
    userId: "",
    overdueFee: 0
  });
  const [users, setUsers] = useState([]);
  const { sendWarning, loading } = useSendWarning();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendWarning(form)

    //reseting after admin send warning
    setForm({
        warningTitle: "",
        warningContent: "",
        userId: "",
        overdueFee: 0
    })
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminDashboardSidebar />
      <div className="flex-1 h-full w-4/5">
        <AdminDashboardHeader />
        <h2 className="text-2xl font-bold text-teal-600 mb-4 px-6 py-4">Send Manual Warning</h2>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white px-6 rounded shadow">
          <div>
            <label className="font-medium">Title</label>
            <input
              type="text"
              name="warningTitle"
              value={form.warningTitle}
              onChange={handleChange}
              className="input input-bordered w-full focus:outline-offset-0"
              required
            />
          </div>

          <div>
            <label className="font-medium">Content</label>
            <textarea
              name="warningContent"
              value={form.warningContent}
              onChange={handleChange}
              className="textarea textarea-bordered w-full focus:outline-offset-0"
              required
            />
          </div>

          <div>
            <label className="font-medium">Target User</label>
            <select
              name="userId"
              value={form.userId}
              onChange={handleChange}
              className="select select-bordered w-full focus:outline-offset-0"
              required
            >
              <option value="">Select user</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.username}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium">Overdue Fee (optional)</label>
            <input
              type="number"
              name="overdueFee"
              value={form.overdueFee}
              onChange={handleChange}
              className="input input-bordered w-full focus:outline-offset-0"
            />
          </div>

          

          <button className="btn btn-primary mt-4" type="submit">
            {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
                ) : "Send Warning"
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSendWarning;
