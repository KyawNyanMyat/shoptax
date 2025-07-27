import { useEffect, useState } from "react";
import MonthlyPieChart from "../../components/MonthlyPieChart";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar";
import AdminDashboardHeader from "../../components/AdminDashboardHeader";
import { FcPieChart } from "react-icons/fc";

const AdminViewPieChart= ()=> {
  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(""); // current month (1-12)
  const [selectedYear, setSelectedYear] = useState(""); // current year
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Build year options dynamically from 2024 to current year
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = 2025; y <= currentYear; y++) {
    yearOptions.push(y);
  }

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/payments/monthly");
        const data = await res.json();

        const filtered = data.filter(
          (item) =>
            item._id.month === selectedMonth &&
            item._id.year === selectedYear
        );

        const formatted = filtered.map((item) => ({
          paymentType: item._id.paymentType,
          totalAmount: item.totalAmount,
        }));

        setChartData(formatted);
      } catch (err) {
        console.error("Error fetching report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="flex max-h-screen">
      <AdminDashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminDashboardHeader setSidebarOpen={setSidebarOpen} />
        <div className="p-6 space-y-4 h-screen overflow-y-auto">
          <h2 className="text-lg md:text-3xl font-bold mb-4 flex items-center">
            <div className="w-15 h-15 text-amber-200 text-center" />
            <FcPieChart className="hidden sm:block sm:text-5xl"/>{`လအလိုက် ငွေပေးချေမှုအမျိုးအစားအချိုးအစားဇယား`}
          </h2>

            {/* Month & Year selectors */}
            <div className="mb-4 flex gap-3 justify-center flex-wrap">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="select select-bordered w-40"
              >
                <option value={""} disabled>လရွေးရန်</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}{" "}
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="select select-bordered w-40"
              >
                <option value={""} disabled>ခုနှစ်ရွေးရန်</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col items-center">
              <ul className="list-disc pl-5 text-gray-700 space-y-1 text-sm sm:text-base ">
                <li>
                  ဤစာမျက်နှာတွင် တစ်လတာအတွင်း လက်ခံရရှိသော စုစုပေါင်းငွေပမာဏကိုဖော်ပြထားသည်။
                </li>
                <li>
                  ဆိုင်ဌားခနှင့် ရက်ကျော်ကြေး ပေးချေမှုအမျိုးအစားများအလိုက် စုစုပေါင်းငွေပမာဏကို ရှင်းလင်းပြသရန် ဖြစ်သည်။
                </li>
                <li>
                  အသုံးပြုသူများသည် လအလိုက်နှင့် နှစ်အလိုက် ရွေးချယ်နိုင်ပြီး၊ 
                  ပြောင်းလဲမှုအတိုင်း ဇယားကို အလိုအလျောက် ပြသမည်ဖြစ်သည်။
                </li>
              </ul>

              {loading ? (
                <div>အချိုးအစားဇယား တင်ဆက်နေသည်</div>
              ) : (
                <MonthlyPieChart data={chartData} />
              )}
            </div>
          </div>
        </div>
    </div>
  );
};

export default AdminViewPieChart;
