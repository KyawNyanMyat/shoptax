import React, { useState, useEffect } from "react";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import useSendWarning from "../../hooks/useSendWarning";
import toast from "react-hot-toast";

const AdminSendWarning = () => {
  const [form, setForm] = useState({
    warningTitle: "",
    warningContent: "",
    userId: "",
    overdueFee: "၀"
  });

  const [users, setUsers] = useState([]);
  const { sendWarning, loading } = useSendWarning();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { warningTitle, warningContent } = form;
    const myanmarRegex = /[\u1000-\u109F\uAA60-\uAA7F]/;

    if (!myanmarRegex.test(warningTitle) || !myanmarRegex.test(warningContent)) {
      return toast.error("ခေါင်းစဉ်နှင့် အကြောင်းအရာတွင် မြန်မာစာ ပါဝင်ရမည်!");
    }

    await sendWarning(form);

    // reset form
    setForm({
      warningTitle: "",
      warningContent: "",
      userId: "",
      overdueFee: ""
    });
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
        <h2 className="text-2xl font-bold text-teal-600 mb-4 px-6 py-4">သတိပေးစာ ပေးပို့ရန်</h2>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white px-6 py-4 rounded shadow">
          <div>
            <label className="font-medium">ခေါင်းစဉ်</label>
            <input
              type="text"
              name="warningTitle"
              value={form.warningTitle}
              onChange={handleChange}
              placeholder="ဥပမာ - ငွေပေးချေမှုမရှိခြင်း"
              className="input input-bordered w-full focus:outline-offset-0"
              required
            />
          </div>

          <div>
            <label className="font-medium">အကြောင်းအရာ</label>
            <textarea
              name="warningContent"
              value={form.warningContent}
              onChange={handleChange}
              placeholder="ဥပမာ - သတ်မှတ်ထားသော နေ့ရက်အတွင်း ငွေချေရန် မပြုလုပ်သဖြင့်..."
              className="textarea textarea-bordered w-full focus:outline-offset-0"
              required
            />
          </div>

          <div>
            <label className="font-medium">အသုံးပြုသူ ရွေးပါ</label>
            <select
              name="userId"
              value={form.userId}
              onChange={handleChange}
              className="select select-bordered w-full focus:outline-offset-0"
              required
            >
              <option value="">အသုံးပြုသူ ရွေးရန်</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>{u.username}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium">ကျန်ငွေပမာဏ</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[၀-၉]+"
              value={form.overdueFee}
              onChange={(e) => {
                  const myanmarNumberRegex = /^[၀-၉]*$/;
                  const input = e.target.value;
                  if (myanmarNumberRegex.test(input)) {
                    setForm(prev => ({ ...prev, overdueFee: input }));
                  }
                }
              }
              className="input input-bordered w-full focus:outline-offset-0"
              placeholder="ဥပမာ - ၅၀၀၀"
              required
            />
          </div>

          <button className="btn btn-primary mt-4 w-full" type="submit" disabled={loading}>
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : "သတိပေးစာ ပေးပို့ရန်"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSendWarning;
