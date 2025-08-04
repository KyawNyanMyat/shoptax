import { Navigate } from "react-router-dom";
import { useUserAuthContext } from "../../context/userAuthContext"
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardHeader from "../../components/DashboardHeader";
import { useState } from "react";
import toast from "react-hot-toast";


const UserChangePassword = ()=>{
    const { userAuth } = useUserAuthContext();
    if (!userAuth) {
        return <Navigate to={"/"} />;
    }

    const userId = userAuth._id;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setloading] = useState(false);
    const [nowPassword, setNowPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    // const 

    const handleSubmit = async (e)=>{
        e.preventDefault()
        setloading(true)
        try {
            const password = await fetch(`/api/users/changepassword/${userId}`,{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({nowPassword, newPassword})
            })
            const data = await password.json();

            if(!password.ok){
                throw new Error(data.message || "အသုံးပြုသူ အချက်အလက်ရယူရာတွင် ပြဿနာတစ်ခုရှိနေသည်။");
            }

            toast.success(data.message)
            setNowPassword("");
            setNewPassword("");
        } catch (error) {
            console.log("Error in UserChangePassword", error.message)
            toast.error(error.message, { id: 'changepassword-error', duration: 2500 })
        }
        finally{
            setloading(false)
        }
    }

    return(
        <div className="flex max-h-screen">
            <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
            <div className="flex-1 flex flex-col">
                <DashboardHeader setSidebarOpen={setSidebarOpen}/>
                <div className="p-6 h-screen overflow-y-auto">
                    <form onSubmit={handleSubmit} className="space-y-4 min-w-[200px] sm:w-full flex flex-col justify-center items-center h-screen">
                        <div className="border border-blue-500 p-7 flex flex-col gap-6 rounded-3xl border-t-4 border-t-blue-600">
                            <h2 className="text-3xl font-bold mb-6 text-center">လျို့၀ှက်နံပါတ် ပြောင်းရန်</h2>
                            <div className="flex flex-col">
                                <label className="label">ယခုလျို့၀ှက်နံပါတ်</label>
                                <input
                                    type="text"
                                    value={nowPassword}
                                    className="input input-bordered bg-gray-100 focus:outline-offset-0"
                                    placeholder="ယခုလျို့၀ှက်နံပါတ်ထည့်ရန်"
                                    onChange={(e)=> setNowPassword(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="label">လျို့၀ှက်နံပါတ်အသစ်</label>
                                <input
                                    type="text"
                                    value={newPassword}
                                    className="input input-bordered bg-gray-100 focus:outline-offset-0"
                                    placeholder="လျို့၀ှက်နံပါတ်အသစ်ထည့်ရန်"
                                    onChange={(e)=> setNewPassword(e.target.value)}
                                />
                            </div>

                            <button
                                className="btn btn-accent w-30"
                            >
                                {loading ? (
                                <span className="loading loading-spinner loading-sm"></span>
                                ) : (
                                "အတည်ပြုရန်"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UserChangePassword