import React from "react";
import { FiAlertCircle } from "react-icons/fi";
import DashboardSidebar from "../../components/DashboardSidebar";
import DashboardHeader from "../../components/DashboardHeader";

const warnings = [
  {
    id: 1,
    title: "Late Payment Notice",
    date: "June 5, 2025",
    description:
      "You have missed your shop tax payment due date. Please settle it as soon as possible to avoid penalties.",
    type: "danger",
  },
  {
    id: 2,
    title: "Water Service Interruption",
    date: "June 3, 2025",
    description:
      "Water supply will be temporarily suspended in your area due to maintenance on June 10.",
    type: "warning",
  },
];

const getTypeColor = (type) => {
  switch (type) {
    case "danger":
      return "bg-red-100 text-red-800 border-red-200";
    case "warning":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const WarningMessages = () => {
    return (
        <div className="flex min-h-screen">
          <DashboardSidebar />
          <div className="flex-1 flex flex-col">
            <DashboardHeader />
            
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Warning Messages</h2>

                <div className="space-y-6">
                    {warnings.map((warn) => (
                    <div
                        key={warn.id}
                        className={`border-l-4 p-4 rounded-xl shadow-sm ${getTypeColor(
                        warn.type
                        )}`}
                    >
                        <div className="flex items-start gap-3">
                        <FiAlertCircle className="text-xl mt-1" />
                        <div>
                            <h3 className="font-semibold">{warn.title}</h3>
                            <p className="text-sm mb-1">{warn.description}</p>
                            <p className="text-xs text-gray-500">Issued: {warn.date}</p>
                        </div>
                        </div>
                    </div>
                    ))}

                    {warnings.length === 0 && (
                    <p className="text-sm text-gray-500">No warning messages at the moment.</p>
                    )}
                </div>
            </div>
          </div>
        </div>
      );
};

export default WarningMessages;
