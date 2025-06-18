// pages/AdminManageShops.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";

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
