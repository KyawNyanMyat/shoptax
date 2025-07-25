// components/AssignUserToShop.jsx
import React, { useEffect, useState } from "react";

const AssignUserToShop = ({ shopId, onAssign }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex gap-2">
      <select
        className="select w-40 select-bordered focus:outline-offset-0"
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
      >
        <option value="">အသုံးပြုသူရွေးပါ</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.username}
          </option>
        ))}
      </select>
      <button
        onClick={ async () => {
            if (!selectedUserId) return;
            setLoading(true);
            await onAssign(shopId, selectedUserId);
            setLoading(false);
          }
        }
        className="btn btn-sm btn-primary"
        disabled={!selectedUserId}
      >
        {loading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : "ဆိုင်ကိုအပ်နှင်းရန်"}
      </button>
    </div>
  );
};

export default AssignUserToShop;
