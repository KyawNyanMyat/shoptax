import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUserAuthContext } from "../../context/userAuthContext";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import { useSocketContext } from "../../context/socketContext";

const UserViewShops = () => {
  const { userAuth } = useUserAuthContext();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const socket = useSocketContext()
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!userAuth) {
    return <Navigate to="/" />;
  }

  const userId = userAuth._id;

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/shops/user/${userId}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "ဆိုင်များကို ယူလို့မရပါ");
        }
        setShops(data);
      } catch (error) {
        console.error("Shops fetch error", error);
        toast.error(error.message, {duration: 1500, id:"noshop"});
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  useEffect(() => {
    if (!socket) return;
  
    const handleShopAssigned = (updatedShop) => {
      setShops(prevShops => [...prevShops, updatedShop]);
    };
  
    const handleShopRemoved = (shop) => {
      setShops(prevShops => prevShops.filter(s => s._id !== shop._id));
    };

    const handleShopTaxChangedForBoth = (updatedShop) => {
      setShops(prev => {
          const index = prev.findIndex(s => s._id === updatedShop._id);
          if (index !== -1) {
              const copy = [...prev];
              copy[index].chargeRate = updatedShop.chargeRate;
              return copy;
          }
          return prev;
      });
    };

    socket.on("shopTaxChanged", handleShopTaxChangedForBoth);
    socket.on("shopAssigned", handleShopAssigned);
    socket.on("shopRemoved", handleShopRemoved);
  
    return () => {
      socket.off("shopAssigned", handleShopAssigned);
      socket.off("shopRemoved", handleShopRemoved);
      socket.off("shopTaxChanged", handleShopTaxChangedForBoth);
    };
  }, [socket]);
  

  return (
    <div className="flex max-h-screen">
      <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader setSidebarOpen={setSidebarOpen} />
            <div className="p-4 sm:p-6 h-screen overflow-y-auto">
            <h1 className="text-xl sm:text-2xl font-bold text-center text-indigo-700 mb-4">
                ဆိုင်အချက်အလက်များ ကြည့်ရှုရန်
            </h1>

            {loading ? (
                <p className="text-center">တင်ဆက်နေသည်...</p>
            ) : shops.length === 0 ? (
                <p className="text-center text-gray-500">ဆိုင်များ မရှိပါ။</p>
            ) : (
                <div className="overflow-x-auto">
                <table className="table table-zebra w-full text-sm text-center">
                    <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th>စဉ်</th>
                        <th>ဈေးရုံအမှတ်</th>
                        <th>ဆိုင်နံပါတ်</th>
                        <th>ဆိုင်ပိုင်ရှင်</th>
                        <th>အခွန်နှုန်း</th>
                    </tr>
                    </thead>
                    <tbody>
                    {shops.map((shop, index) => (
                        <tr key={shop._id}>
                        <td>{index + 1}</td>
                        <td>{shop.marketHallNo}</td>
                        <td>{shop.shopNo}</td>
                        <td>
                            {shop.userId ? (
                            <span className="text-green-600 font-medium">{shop.userId.username}</span>
                            ) : (
                            <span className="text-red-500">မရှိသေးပါ</span>
                            )}
                        </td>
                        <td>{shop.chargeRate}</td>
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

export default UserViewShops;
