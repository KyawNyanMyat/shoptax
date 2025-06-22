// components/AssignUserToShop.jsx
import React, { useEffect, useState } from "react";

const AssignUserToShop = ({ shopId, onAssign }) => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

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
        className="select select-sm select-bordered focus:outline-offset-0"
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(e.target.value)}
      >
        <option value="">Select user</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.username}
          </option>
        ))}
      </select>
      <button
        onClick={() => selectedUserId && onAssign(shopId, selectedUserId)}
        className="btn btn-sm btn-primary"
        disabled={!selectedUserId}
      >
        Assign
      </button>
    </div>
  );
};

export default AssignUserToShop;
