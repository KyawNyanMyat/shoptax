import DashboardHeader from "../../components/DashboardHeader";
import DashboardSidebar from "../../components/DashboardSidebar";


const DashboardHome = () => {
  const userName = "Kyaw Nyan Myat";
  const today = new Date().toLocaleDateString();

  const summary = [
    {
      label: "Last Payment",
      value: "May 15, 2025",
      color: "bg-green-100 text-green-800",
    },
    {
      label: "Next Due",
      value: "June 15, 2025",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      label: "Unread Warnings",
      value: "2",
      color: "bg-red-100 text-red-800",
    },
    {
      label: "Unread Receipts",
      value: "3",
      color: "bg-blue-100 text-blue-800",
    },
  ];

  const activities = [
    "Water supply maintenance completed in Ward 4.",
    "New garbage collection time starts next Monday.",
  ];

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        
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
                <p className="text-lg font-bold">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Latest Activity */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Latest Notices</h3>
            <ul className="list-disc pl-6 text-sm text-gray-700 space-y-2">
              {activities.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
