import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const generateChartData = (
  reviews: any[],
  timeframe: "daily" | "weekly" | "monthly" | "yearly"
) => {
  const dataMap = new Map<string, number>();

  reviews.forEach((review) => {
    const d = new Date(review.createdAt);
    let key = "";
    if (timeframe === "daily") {
      key = d.toLocaleDateString("en-CA"); // YYYY-MM-DD
    } else if (timeframe === "weekly") {
      const tempD = new Date(d);
      tempD.setDate(tempD.getDate() - tempD.getDay()); // Sunday
      key = tempD.toLocaleDateString("en-CA");
    } else if (timeframe === "monthly") {
      key = d.toISOString().substring(0, 7); // YYYY-MM
    } else if (timeframe === "yearly") {
      key = d.getFullYear().toString();
    }
    dataMap.set(key, (dataMap.get(key) || 0) + 1);
  });

  const sortedKeys = Array.from(dataMap.keys()).sort();
  return sortedKeys.map((key) => {
    let label = key;
    if (timeframe === "monthly") {
      const [y, m] = key.split("-");
      label = new Date(Number(y), Number(m) - 1).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } else if (timeframe === "weekly") {
      label = `Week of ${key}`;
    }
    return {
      name: label,
      Reviews: dataMap.get(key),
    };
  });
};

interface ReviewTrendChartProps {
  allReviews: any[];
}

export function ReviewTrendChart({ allReviews }: ReviewTrendChartProps) {
  const [timeframe, setTimeframe] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("daily");

  const chartData = useMemo(
    () => generateChartData(allReviews, timeframe),
    [allReviews, timeframe]
  );

  return (
    <div className="w-full max-w-7xl mx-auto mb-10 bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-sm md:text-base text-[#1BE1F3]">
          Review Growth Trend
        </h3>
        <div className="flex bg-[#111] p-1 rounded-lg border border-[#2A2A2A] text-[10px] font-chakra-petch">
          {(["daily", "weekly", "monthly", "yearly"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-md transition-colors capitalize ${
                timeframe === tf
                  ? "bg-[#1BE1F3] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[300px] w-full font-chakra-petch text-[10px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2A2A2A"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#888888"
                tick={{ fill: "#888888" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                tick={{ fill: "#888888" }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0A0A0A",
                  borderColor: "#1BE1F3",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                itemStyle={{ color: "#1BE1F3" }}
              />
              <Line
                type="monotone"
                dataKey="Reviews"
                stroke="#1BE1F3"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#0A0A0A",
                  stroke: "#1BE1F3",
                  strokeWidth: 2,
                }}
                activeDot={{ r: 6, fill: "#1BE1F3" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No data available for the selected timeframe.
          </div>
        )}
      </div>
    </div>
  );
}
