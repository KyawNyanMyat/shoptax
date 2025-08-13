import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function MonthlyPaymentsChart({ selectedYear }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      const res = await fetch(`/api/payments/monthly?year=${selectedYear}`);
      const data = await res.json();

      // Prepare arrays for 12 months
      const shopFees = Array(12).fill(0);
      const overdueFees = Array(12).fill(0);
      const totals = Array(12).fill(0);

      data.forEach((item) => {
        const monthIndex = item._id.month - 1;
        shopFees[monthIndex] = item.totalShopFee || 0;
        overdueFees[monthIndex] = item.totalOverDueFee || 0;
        totals[monthIndex] = item.totalAmount || 0;
      });

      setChartData({
        labels: monthLabels,
        datasets: [
          {
            label: "ဆိုင်ဌားခ+ေရအခွန်",
            data: shopFees,
            backgroundColor: "#F97316", // Orange
          },
          {
            label: "ရက်ေကျာ်ေြကး",
            data: overdueFees,
            backgroundColor: "#3B82F6", // Blue
          },
          {
            label: "စုစုေပါင်း",
            data: totals,
            backgroundColor: "#10B981", // Green
          },
        ],
      });
    };

    fetchReport();
  }, [selectedYear]);

  if (!chartData) return <div>Loading...</div>;

  return (
    <div style={{ overflowX: "auto", width: "100%", height: '400px' }}>
      <div style={{ minWidth: "600px", height: '100%' }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: `${selectedYear} အတွက်လစဉ်ငွေပေးချေမှုဇယား` },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: "Amount (Kyats)",
                },
                ticks: {
                  stepSize: 5000,
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Months",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
  
}
