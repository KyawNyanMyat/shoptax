// pages/AdminManageShops.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import AssignUserToShop from "../../components/AssignUserToShop";
import toast from "react-hot-toast";

const AdminManageShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShops = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/shops");
            const data = await res.json();
            setShops(data);
        } catch (error) {
            console.error("Failed to fetch shops", error);
        }
        finally{
            setLoading(false)
        }
    };

    fetchShops();
  }, []);

  const handleAssign = async (shopId, userId) => {
    try {
      const res = await fetch(`/api/shops/${shopId}/assign`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      console.log(data,"in")
      if (!res.ok) throw new Error(data.message);
      // Refresh the shop list after assigning
      //In the future (Socket)
      toast.success("Assign Successfully", { duration: 1500})
    } catch (err) {
        console.log('Error in adminManageShop.jsx', err)
      toast.error(err.message || "Failed to assign user", {duration: 1500});
    }
  };
  

  return (
    <div className="flex min-h-screen">
        <AdminDashboardSidebar />
        <div className="flex-1 flex flex-col h-full w-4/5">
            <AdminDashboardHeader />

        {loading ? (
        <p>Loading Shops...</p>
        ) : shops.length == 0 ? (
        <p className="text-gray-500">No Shops found.</p>
        ) : (

            <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-teal-600">Manage Shops</h2>
                {/* <Link
                to="/admin/create-shop"
                className="btn btn-sm bg-teal-600 text-white hover:bg-teal-700"
                >
                + Add Shop
                </Link> */}
            </div>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full text-sm">
                <thead className="bg-gray-200 text-gray-700">
                    <tr>
                    <th>No</th>
                    <th>ShopID</th>
                    <th>Market Hall No</th>
                    <th>Shop No</th>
                    <th>Occupied By</th>
                    <th>Charge Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {shops.map((s, idx) => (
                    <tr key={s._id}>
                        <td>{idx + 1}</td>
                        <td>{s._id}</td>
                        <td>{s.marketHallNo}</td>
                        <td>{s.shopNo}</td>
                        <td>
                            {s.userId == null ? (
                                <AssignUserToShop
                                shopId={s._id}
                                onAssign={(shopId, userId) => handleAssign(shopId, userId)}
                                />
                            ) : (
                                s.userId.username
                            )}
                        </td>
                        <td>{s.chargeRate}</td>
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

export default AdminManageShops;
