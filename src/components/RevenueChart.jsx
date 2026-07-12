import { useState, useEffect } from "react";
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
import { revenueData as fallbackRevenueData } from "../data/analyticsData";
import { useTheme } from "../context/ThemeContext";
import { dashboardAPI } from "../services/api";
import clsx from "clsx";

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={clsx(
        "px-4 py-3 rounded-xl text-xs shadow-2xl border backdrop-blur-xl",
        isDark
          ? "bg-[#0f0d1a]/95 border-purple-500/30 text-purple-200"
          : "bg-white border-purple-200 text-purple-950"
      )}
    >
      <p className="font-bold mb-2 tracking-wide text-purple-400">{label}</p>

      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 mt-1">
          <span
            style={{ background: p.color }}
            className="w-2 h-2 rounded-full inline-block shadow-[0_0_6px_rgba(168,85,247,0.5)]"
          />

          <span
            className={
              isDark ? "text-purple-400/80" : "text-purple-600"
            }
          >
            {p.name}:
          </span>

          <span className="font-bold">
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
  const [data, setData] = useState(fallbackRevenueData);

  useEffect(() => {
    dashboardAPI.getConsumptionData()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setData(res.data);
        }
      })
      .catch(err => {
        console.warn("Could not fetch consumption trend data, using fallback:", err);
      });
  }, []);

  const gridColor = isDark ? "rgba(168, 85, 247, 0.08)" : "#f3e8ff";
  const axisColor = isDark ? "#8b7faa" : "#6b21a8";

  // 3D Tilt interactive effects
  const handleMouseMove3D = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 5; // Max 5 degree tilt for large components
    const rotateX = -((y - centerY) / centerY) * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    card.style.boxShadow = isDark
      ? "0 20px 30px rgba(168, 85, 247, 0.2), 0 0 15px rgba(168, 85, 247, 0.1)"
      : "0 15px 25px rgba(168, 85, 247, 0.05)";
  };

  const handleMouseLeave3D = (e) => {
    const card = e.currentTarget;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    card.style.boxShadow = "";
  };

  return (
    <div
      onMouseMove={handleMouseMove3D}
      onMouseLeave={handleMouseLeave3D}
      className={clsx(
        "rounded-2xl p-5 border backdrop-blur-md transition-all duration-300 ease-out cursor-pointer select-none",
        isDark
          ? "bg-[#16122d]/60 border-purple-500/10 shadow-[0_4px_25px_rgba(0,0,0,0.3)]"
          : "bg-white/80 border-purple-100 shadow-sm"
      )}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Header */}
      <div className="mb-5" style={{ transform: "translateZ(20px)" }}>
        <h2 className="font-bold text-base tracking-wide bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          Grid Demand & Usage Analytics
        </h2>

        <p
          className={clsx(
            "text-xs mt-0.5 font-medium",
            isDark ? "text-purple-500/80" : "text-purple-400"
          )}
        >
          Real-time 12-month electricity consumption flow
        </p>
      </div>

      <div style={{ transform: "translateZ(10px)" }}>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={data}
            margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="consGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#a855f7"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="#a855f7"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#06b6d4"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="#06b6d4"
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
              tick={{ fill: axisColor, fontSize: 10, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fill: axisColor, fontSize: 10, fontWeight: 600 }}
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
              name="Target Ceiling"
              stroke="#06b6d4"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="url(#targetGrad)"
              dot={false}
            />

            <Area
              type="monotone"
              dataKey="consumption"
              name="Actual Load"
              stroke="#a855f7"
              strokeWidth={2.5}
              fill="url(#consGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "#a855f7", stroke: "#ffffff", strokeWidth: 1.5 }}
            />

            <Legend
              wrapperStyle={{
                fontSize: 10,
                fontWeight: 600,
                paddingTop: 12,
                color: axisColor,
              }}
              iconType="circle"
              iconSize={8}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}