import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { revenueData } from "../data/analyticsData";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={clsx(
        "px-3 py-3 rounded-xl text-sm shadow-xl border",
        isDark
          ? "bg-slate-800 border-slate-700 text-slate-100"
          : "bg-white border-slate-200 text-slate-800"
      )}
    >
      <p className="font-semibold mb-2">{label}</p>

      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span
            style={{ background: p.color }}
            className="w-2 h-2 rounded-full inline-block"
          />

          <span
            className={
              isDark ? "text-slate-400" : "text-slate-500"
            }
          >
            {p.name}:
          </span>

          <span className="font-medium">
            {p.value} kWh
          </span>
        </div>
      ))}
    </div>
  );
};

export default function RevenueChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const gridColor = isDark ? "#1e293b" : "#f1f5f9";
  const axisColor = isDark ? "#475569" : "#94a3b8";

  return (
    <div
      className={clsx(
        "rounded-2xl p-5 border",
        isDark
          ? "bg-slate-800/60 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      )}
    >
      {/* Header */}
      <div className="mb-5">
        <h2 className="font-bold text-base">
          Energy Consumption Trends
        </h2>

        <p
          className={clsx(
            "text-xs mt-0.5",
            isDark ? "text-slate-500" : "text-slate-400"
          )}
        >
          12-month electricity usage analysis
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={revenueData}
          margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="consGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="#0ea5e9"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="#0ea5e9"
                stopOpacity={0}
              />
            </linearGradient>

            <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="#8b5cf6"
                stopOpacity={0.2}
              />
              <stop
                offset="95%"
                stopColor="#8b5cf6"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke={gridColor}
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            tick={{ fill: axisColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fill: axisColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v} kWh`}
          />

          <Tooltip
            content={<CustomTooltip isDark={isDark} />}
          />

          <Area
            type="monotone"
            dataKey="target"
            name="Target Usage"
            stroke="#8b5cf6"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="url(#targetGrad)"
            dot={false}
          />

          <Area
            type="monotone"
            dataKey="consumption"
            name="Actual Usage"
            stroke="#0ea5e9"
            strokeWidth={2.5}
            fill="url(#consGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#0ea5e9" }}
          />

          <Legend
            wrapperStyle={{
              fontSize: 11,
              paddingTop: 12,
              color: axisColor,
            }}
            iconType="circle"
            iconSize={8}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}