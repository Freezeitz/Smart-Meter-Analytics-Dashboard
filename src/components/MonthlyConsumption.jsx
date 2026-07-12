import { useState, useEffect } from "react";
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
import { revenueData as fallbackRevenueData } from "../data/analyticsData";
import { useTheme } from "../context/ThemeContext";
import { dashboardAPI } from "../services/api";
import clsx from "clsx";

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      className={clsx(
        "px-3 py-2 rounded-xl text-xs shadow-2xl border backdrop-blur-xl",
        isDark
          ? "bg-[#0f0d1a]/95 border-purple-500/30 text-purple-200"
          : "bg-white border-purple-200 text-purple-950"
      )}
    >
      <p className="font-bold mb-1 tracking-wide text-purple-400">{label}</p>

      <p className="font-medium">
        Consumption:{" "}
        <span className="font-black text-fuchsia-400">
          {payload[0].value} kWh
        </span>
      </p>
    </div>
  );
};

export default function MonthlyRevenue() {
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
        console.warn("Could not fetch monthly consumption, using fallback:", err);
      });
  }, []);

  const gridColor = isDark ? "rgba(168, 85, 247, 0.08)" : "#f3e8ff";
  const axisColor = isDark ? "#8b7faa" : "#6b21a8";

  const maxConsumption = data.length > 0 
    ? Math.max(...data.map((d) => d.consumption))
    : 0;

  // 3D Tilt interactive effects
  const handleMouseMove3D = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 5;
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
      <div className="mb-4" style={{ transform: "translateZ(20px)" }}>
        <h2 className="font-bold text-base tracking-wide bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          Monthly Grid Load
        </h2>

        <p
          className={clsx(
            "text-xs mt-0.5 font-medium",
            isDark ? "text-purple-500/80" : "text-purple-400"
          )}
        >
          Metered electricity distribution per month (kWh)
        </p>
      </div>

      <div style={{ transform: "translateZ(10px)" }}>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={data}
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
              cursor={{ fill: "rgba(168, 85, 247, 0.05)" }}
            />

            <Bar
              dataKey="consumption"
              radius={[4, 4, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.consumption === maxConsumption
                      ? "#a855f7"
                      : isDark
                      ? "#2a1e4d"
                      : "#f3e8ff"
                  }
                  style={{
                    filter: entry.consumption === maxConsumption && isDark ? "drop-shadow(0 0 6px #a855f7)" : "none"
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}