import { useEffect, useState } from "react";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardSidebar from "../../components/DashboardSidebar";
import toast from "react-hot-toast";


const DashboardHome = () => {
  const userName = "Kyaw Nyan Myat"; // In the future
  const userId = "684c2b1ec0a2a3d814a8d2ca"; //In the future
  const today = new Date().toLocaleDateString();

  const [lastPayment, setLastPayment] = useState(null)
  const [nextPaymentDueDate, setNextPaymentDueDate] = useState(null)
  const [unReadWarning, setUnReadWarning] = useState([])
  const [unReadReceipt, setUnReadReceipt] = useState([])

  const summary = [
    {
      label: "Last Payment",
      value: new Date(lastPayment).toLocaleDateString("en-CA"),
      color: "bg-green-100 text-green-800",
    },
    {
      label: "Next Due",
      value: new Date(nextPaymentDueDate).toLocaleDateString("en-CA"),
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      label: "Unread Warnings",
      value: unReadWarning.length > 0 ? unReadWarning.length : 0,
      color: "bg-red-100 text-red-800",
    },
    {
      label: "Unread Receipts",
      value: unReadReceipt.length > 0 ? unReadReceipt.length : 0,
      color: "bg-blue-100 text-blue-800",
    },
  ];

  const regulations = [
    "All shop owners must renew their monthly shop tax by the 10th of each month.",
    "Unauthorized disposal of waste in public areas is strictly prohibited.",
    // "Water usage beyond allocated hours may result in additional charges.",
  ];
  

  useEffect(()=>{
    const forDashBoard = async()=>{
      try {
        const res = await fetch(`/api/payments/user/${userId}`)
        const data = await res.json();

        setLastPayment(data.paidDate)
        setNextPaymentDueDate(data.nextPaymentDueDate)

        const receiptRes = await fetch(`/api/receipts/unread/${userId}`)
        const receiptData = await receiptRes.json();

        setUnReadReceipt(receiptData)

        const warningRes = await fetch(`/api/warnings/unread/${userId}`)
        const warningData = await warningRes.json();

        setUnReadWarning(warningData)

        if(!res.ok || !receiptRes || !warningRes) {
          throw new Error(data.message)
        }
      } catch (error) {
        console.log("Error in Dashboard Home", error.message)
      }
    }

    forDashBoard()
  },[])

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
        {/* In the future Clicking these four */}
        {/* Dashboard home */}
        <div className="p-6 space-y-10">
          <div>
            <h2 className="text-2xl font-bold">Welcome, {userName}!</h2>
            <p className="text-sm text-gray-500">Today is {today}</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {summary.map((item, idx) => (
              <div
                key={idx}
                className={`card ${item.color} shadow-md p-4 rounded-2xl`}
              >
                <h3 className="text-sm font-medium">{item.label}</h3>
                <p className="text-lg font-bold">
                  {item.value !== null && item.value !== undefined
                    ? item.value
                    : <span className="loading loading-spinner loading-xs"></span>}
                </p>

              </div>
            ))}
          </div>

          {/* Township Regulations */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Township Regulations</h3>
            <ul className="list-disc pl-6 text-sm text-gray-700 space-y-2">
              {regulations.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
