import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import AssignUserToShop from "../../components/AssignUserToShop";
import toast from "react-hot-toast";
import { useAdminAuthContext } from "../../context/adminAuthContext";
import useCreateShop from "../../hooks/useCreateShop";
import { useRemoveUserFromShop } from "../../hooks/useRemoveUserFromShop";
import { useSocketContext } from "../../context/socketContext";
import useChangeTax from "../../hooks/useChangeTax";

const AdminManageShops = () => {
    const { adminAuth } = useAdminAuthContext();
    if (!adminAuth) {
      return <Navigate to={"/admin"} />;
    }

    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const { shoploading, createShop } = useCreateShop()

    const [selectedShop, setSelectedShop] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { removeUserFromShop } = useRemoveUserFromShop();
    const socket = useSocketContext()

    const [changeTax, setChangeTax] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [taxValue, setTaxValue] = useState({
        _id: "",
        value: ""
    })
    const { taxLoading, changeShopTax } = useChangeTax()

    const handleRemoveUser = async (shopId) => {
        await removeUserFromShop(shopId);
        setSelectedShop(null);
    };

    const handleShopTaxChange = async (shopId, taxValue)=>{
        await changeShopTax(shopId, taxValue);
        setTaxValue({
             _id: "",
            value: ""
        })
    }

    useEffect(() => {
        const fetchShops = async () => {
            setLoading(true)
            try {
                const res = await fetch("/api/shops");
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "ဆိုင်အချက်အလက်များကို ရယူရာတွင် ပြဿနာတစ်ခု ဖြစ်ပွားနေပါသည်။");
                }
                setShops(data);
            } catch (error) {
                console.error("ဆိုင်အချက်အလက်များ ရယူခြင်းမအောင်မြင်ပါ", error);
                toast.error(error.message, { id: "admin-manageShop-error" });
            } finally {
                setLoading(false);
            }
        };

        fetchShops();
    }, []);

    useEffect(()=>{
        if(!socket) return;

        const handleShopAssignedToUser = (updatedShop)=>{
            setShops((prevShops)=> {
                const index = prevShops.findIndex((s) => s._id === updatedShop._id);

                if (index !== -1) {
                const newShops = [...prevShops];
                newShops[index] = updatedShop;
                return newShops;
                }

                // Don't add if shop not found
                return prevShops;
            })
        }

        const handleShopUserRemoved = (updatedShop) => {
            setShops((prev) => {
              const idx = prev.findIndex((s) => s._id === updatedShop._id);
              if (idx !== -1) {
                const updated = [...prev];
                updated[idx] = updatedShop;
                return updated;
              }
              return prev;
            });
        }

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
        socket.on("shopAssignedToUser", handleShopAssignedToUser)
        socket.on("shopUserRemoved", handleShopUserRemoved);
          
        return ()=>{
            socket.off("shopTaxChanged", handleShopTaxChangedForBoth)
            socket.off("shopAssignedToUser", handleShopAssignedToUser)
            socket.off("shopUserRemoved", handleShopUserRemoved)
        }
    },[socket])

    const handleAssign = async (shopId, userId) => {
        try {
            const res = await fetch(`/api/shops/${shopId}/assign`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            toast.success("အသုံးပြုသူအား ဆိုင်အပ်နှင်းမှု အောင်မြင်ပါသည်။", { duration: 1500 });
        } catch (err) {
            console.log('AdminManageShops.jsx မှာ ပြဿနာရှိတယ်', err)
            toast.error(err.message || "ဆိုင်အပ်နှင်းမှု မအောင်မြင်ပါ", { duration: 1500 });
        }
    };

    return (
        <div className="flex max-h-screen">
            <AdminDashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminDashboardHeader setSidebarOpen={setSidebarOpen} />
                {loading ? (
                    <p>ဆိုင်အချက်အလက်များကို တင်ဆက်နေသည်...</p>
                ) : shops.length === 0 ? (
                    <p className="text-gray-500">ဆိုင်များ မတွေ့ပါ။</p>
                ) : (
                    <div className="p-6 space-y-4 h-screen overflow-scroll">
                        <div className="flex justify-between items-center flex-wrap">
                            <h2 className="text-2xl font-bold text-teal-600">ဆိုင်များ စီမံခန့်ခွဲမှု</h2>
                            <Link
                                to="/admin/manageshop/create-shop"
                                className="btn btn-sm bg-teal-600 text-white hover:bg-teal-700"
                                >
                                + ဆိုင်အသစ် ထည့်ရန်
                            </Link>
                        </div>

                        <div className="p-2 overflow-x-auto">
                            <table className="table table-zebra min-w-[700px] w-full text-sm text-center">
                                <thead className="bg-gray-200 text-gray-700">
                                    <tr>
                                        <th>စဉ်</th>
                                        <th>ဆိုင် ID</th>
                                        <th>ဈေးရုံနံမှတ်</th>
                                        <th>ဆိုင်နံပါတ်</th>
                                        <th>အပ်နှင်းထားသူ</th>
                                        <th>အခွန်နှုန်း</th>
                                        <th>လုပ်ဆောင်ချက်</th>
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
                                                    <div className="flex gap-2 items-center justify-between">
                                                        <span className="whitespace-nowrap">{s.userId.username}</span>
                                                        <button
                                                        className="btn btn-sm btn-error whitespace-nowrap"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedShop(s);
                                                            setShowConfirmModal(true);
                                                        }}
                                                        >
                                                        ဆိုင်မှဖယ်ရှားရန်
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                            <td>{s.chargeRate}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-primary whitespace-nowrap"
                                                    onClick={(e)=>{
                                                        e.stopPropagation()
                                                        setChangeTax(true)
                                                        setTaxValue({"_id":s._id, "value":s.chargeRate})
                                                    }}
                                                >
                                                    အခွန်နှုန်းပြောင်းလဲရန်
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {showConfirmModal && selectedShop && (
                        <dialog className="modal modal-open" onClick={() => setShowConfirmModal(false)}>
                            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                            <h3 className="font-bold text-lg text-red-600">အတည်ပြုချက်</h3>
                            <p className="py-2">
                                ဆိုင် <span className="font-semibold">{selectedShop.shopNo}</span> မှ 
                                အသုံးပြုသူ <span className="font-semibold">{selectedShop.userId?.username}</span> ကို 
                                ဖယ်ရှားရန် သေချာပါသလား?
                            </p>
                            <div className="modal-action">
                                <button
                                className="btn"
                                onClick={() => setShowConfirmModal(false)}
                                >
                                ပိတ်မည်
                                </button>
                                <button
                                className="btn btn-error"
                                onClick={() => {
                                    handleRemoveUser(selectedShop._id);
                                    setShowConfirmModal(false);
                                }}
                                >
                                အတည်ပြုမည်
                                </button>
                            </div>
                            </div>
                        </dialog>
                        )}

                        {
                            changeTax && (
                                <div className="modal modal-open" onClick={()=> setChangeTax(false)}>
                                    <div className="modal-box" onClick={(e)=> e.stopPropagation()}>
                                        <h3 className="font-bold text-lg text-red-600 text-center mb-4">အတည်ပြုချက်</h3>
                                        <p className="py-2">
                                            <span className="font-semibold px-4">အခွန်နှုန်း</span>
                                            <input 
                                                type="text"
                                                value={taxValue.value} 
                                                className="input input-bordered"
                                                onChange={(e)=> setTaxValue({_id:taxValue._id, value:e.target.value})}
                                            />
                                        </p>
                                        <div className="modal-action flex justify-center">
                                            <button
                                            className="btn"
                                            onClick={() => setChangeTax(false)}
                                            >
                                            ပိတ်မည်
                                            </button>
                                            <button
                                            className="btn btn-error"
                                            onClick={() => {
                                                handleShopTaxChange(taxValue._id, taxValue.value)
                                                setChangeTax(false)
                                            }}
                                            >
                                            {taxLoading ? (
                                                <span className="loading loading-spinner loading-sm"></span>
                                                ) : (
                                                'အတည်ပြုမည်'
                                            )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>    
                )}
            </div>
        </div>
    );
};

export default AdminManageShops;
