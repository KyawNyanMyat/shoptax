import React from "react";
import { FiFileText } from "react-icons/fi";
import DashboardHeader from "../../components/DashboardHeader";
import DashboardSidebar from "../../components/DashboardSidebar";

const receipts = [
  {
    id: "RCPT-10231",
    date: "June 1, 2025",
    title: "Shop Tax Receipt",
    buildingNo: "B-12",
    shopNo: "S-45",
    shopkeeper: "U Tun Tun",
    year: "2024-2025",
    month: "June",
    amount: "20,000 MMK",
  },
  {
    id: "RCPT-10198",
    date: "May 1, 2025",
    title: "Shop Tax Receipt",
    buildingNo: "B-12",
    shopNo: "S-45",
    shopkeeper: "U Tun Tun",
    year: "2024-2025",
    month: "May",
    amount: "20,000 MMK",
  },
  {
    id: "RCPT-10120",
    date: "April 1, 2025",
    title: "Shop Tax Receipt",
    buildingNo: "B-12",
    shopNo: "S-45",
    shopkeeper: "U Tun Tun",
    year: "2024-2025",
    month: "April",
    amount: "20,000 MMK",
  },
  {
    id: "RCPT-10120",
    date: "April 1, 2025",
    title: "Shop Tax Receipt",
    buildingNo: "B-12",
    shopNo: "S-45",
    shopkeeper: "U Tun Tun",
    year: "2024-2025",
    month: "April",
    amount: "20,000 MMK",
  },
];

const Receipts = () => {
  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Your Receipts</h2>

          {receipts.length === 0 ? (
            <p className="text-sm text-gray-500 mt-4">No receipts available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {receipts.map((r) => (
                <div
                  key={r.id}
                  className="bg-white shadow-md rounded-xl p-5 border border-base-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{r.title}</h3>
                    <FiFileText className="text-primary text-xl" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Date: {r.date}</p>
                  <p className="text-sm text-gray-500 mb-1">Receipt ID: {r.id}</p>
                  <p className="text-sm text-gray-500 mb-1">Building No: {r.buildingNo}</p>
                  <p className="text-sm text-gray-500 mb-1">Shop No: {r.shopNo}</p>
                  <p className="text-sm text-gray-500 mb-1">Shopkeeper: {r.shopkeeper}</p>
                  <p className="text-sm text-gray-500 mb-1">Year: {r.year}</p>
                  <p className="text-sm text-gray-500 mb-1">Month: {r.month}</p>
                  <p className="text-sm font-medium mt-2">
                    Amount: <span className="text-primary">{r.amount}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Receipts;
