import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { revenueData } from "../data/analyticsData";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={clsx(
        "px-3 py-2 rounded-xl text-xs shadow-xl border",
        isDark
          ? "bg-slate-800 border-slate-700 text-slate-100"
          : "bg-white border-slate-200 text-slate-800"
      )}
    >
      <p className="font-semibold mb-1">{label}</p>

      <p>
        Consumption:{" "}
        <span className="font-bold text-sky-400">
          {payload[0].value} kWh
        </span>
      </p>
    </div>
  );
};

export default function MonthlyRevenue() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const gridColor = isDark ? "#1e293b" : "#f1f5f9";
  const axisColor = isDark ? "#475569" : "#94a3b8";

  const maxConsumption = Math.max(
    ...revenueData.map((d) => d.consumption)
  );

  return (
    <div
      className={clsx(
        "rounded-2xl p-5 border",
        isDark
          ? "bg-slate-800/60 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      )}
    >
      <div className="mb-4">
        <h2 className="font-bold text-base">
          Monthly Consumption
        </h2>

        <p
          className={clsx(
            "text-xs mt-0.5",
            isDark ? "text-slate-500" : "text-slate-400"
          )}
        >
          Energy usage per month (kWh)
        </p>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart
          data={revenueData}
          margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
          barSize={18}
        >
          <CartesianGrid
            stroke={gridColor}
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tick={{ fill: axisColor, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: axisColor, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v} kWh`}
          />

          <Tooltip
            content={<CustomTooltip isDark={isDark} />}
            cursor={{ fill: "transparent" }}
          />

          <Bar
            dataKey="consumption"
            radius={[4, 4, 0, 0]}
          >
            {revenueData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  entry.consumption === maxConsumption
                    ? "#0ea5e9"
                    : isDark
                    ? "#1e3a4f"
                    : "#e0f2fe"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}