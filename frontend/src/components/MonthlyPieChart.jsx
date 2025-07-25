import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = [ "#F97316", "#3B82F6"];
const renderTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white p-2 rounded shadow">
      <p>{item.name === "Shop Rent Cost" ? "စုစုပေါင်းဆိုင်ဌားခ" : "စုစုပေါင်းရက်ကျော်ကြေး"} / {item.value + "ကျပ်"}</p>
    </div>
  );
};

const renderLegend = ({ payload }) => (
  <div className="flex flex-col gap-4">
    <ul className="flex flex-col gap-4" >
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center">
          <span
            className="w-3 h-3 inline-block rounded mr-2"
            style={{ backgroundColor: entry.color }}
          ></span>
          <span className="whitespace-nowrap">
            {entry.value === "Shop Rent Cost"
              ? "စုစုပေါင်းဆိုင်ဌားခ"
              : "စုစုပေါင်းရက်ကျော်ကြေး"} / {entry.payload.totalAmount + " ကျပ်"}
          </span>
        </li>
      ))}
    </ul>
    <div>
      <span
        className="w-3 h-3 inline-block rounded mr-2 bg-green-500"
      ></span>
      <span className="whitespace-nowrap">
        {"တလစုစုပေါင်းငွေ / " + payload.reduce((accumulate, current)=> current.totalAmount + accumulate,0) + " ကျပ်"}
      </span>
    </div>
    
  </div>
);

const MonthlyPieChart = ({ data }) => {
  const isEmpty = !data || data.length === 0;

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
      <PieChart width={250} height={300}>
        <Pie
          data={isEmpty ? [{ name: "မရှိပါ", totalAmount: 1 }] : data}
          dataKey="totalAmount"
          nameKey="paymentType"
          cx="50%"
          cy="50%"
          outerRadius={95}
          label={false}
        >
          {(isEmpty ? [{ fill: "#ccc" }] : data).map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={isEmpty ? "#ccc" : COLORS[index]}
            />
          ))}
        </Pie>
        {!isEmpty && <Tooltip content={renderTooltip} position={{y:1}}/>}
      </PieChart>
      {!isEmpty && <div>{renderLegend({ payload: data.map((item, i) => ({ ...item, color: COLORS[i], value: item.paymentType, payload: item })) })}</div>}
      {isEmpty && (
        <span className="text-sm text-gray-500 mt-0 pt-0">
          အချိုးအစားအချက်အလက် မရှိပါ။
        </span>
      )}
    </div>
  );
};

export default MonthlyPieChart;
