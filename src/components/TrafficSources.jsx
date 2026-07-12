import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { trafficSources as fallbackTrafficSources } from "../data/analyticsData";
import { useTheme } from "../context/ThemeContext";
import { dashboardAPI } from "../services/api";
import clsx from "clsx";

const CustomTooltip = ({ active, payload, isDark }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];

  return (
    <div
      className={clsx(
        "px-3 py-2 rounded-xl text-xs shadow-2xl border backdrop-blur-xl",
        isDark
          ? "bg-[#0f0d1a]/95 border-purple-500/30 text-purple-200"
          : "bg-white border-purple-200 text-purple-950"
      )}
    >
      <span style={{ color: d.payload.color }} className="font-bold">
        {d.name}
      </span>
      : <span className="font-extrabold">{d.value}%</span>
    </div>
  );
};

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, value }) => {
  const r = outerRadius + 15;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);

  if (value < 8) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#8b7faa"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={10}
      fontWeight={700}
    >
      {value}%
    </text>
  );
};

export default function TrafficSources() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState(fallbackTrafficSources);

  useEffect(() => {
    dashboardAPI.getCategoryData()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setData(res.data);
        }
      })
      .catch(err => {
        console.warn("Could not fetch categories data, using fallback:", err);
      });
  }, []);

  // 3D Tilt interactive effects
  const handleMouseMove3D = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 6; // Max 6 degree tilt
    const rotateX = -((y - centerY) / centerY) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
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
      <div className="mb-4" style={{ transform: "translateZ(20px)" }}>
        <h2 className="font-bold text-base tracking-wide bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
          Grid Sector Breakdown
        </h2>

        <p
          className={clsx(
            "text-xs mt-0.5 font-medium",
            isDark ? "text-purple-500/80" : "text-purple-400"
          )}
        >
          Consumption ratios by energy category
        </p>
      </div>

      <div className="flex flex-col items-center" style={{ transform: "translateZ(10px)" }}>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={4}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  stroke={isDark ? "#0a0a1a" : "#ffffff"}
                  strokeWidth={2}
                  className="focus:outline-none"
                />
              ))}
            </Pie>

            <Tooltip
              content={<CustomTooltip isDark={isDark} />}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="w-full mt-2 space-y-2" style={{ transform: "translateZ(15px)" }}>
          {data.map((src) => (
            <div
              key={src.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{
                    background: src.color,
                    boxShadow: isDark ? `0 0 8px ${src.color}dd` : "none"
                  }}
                />

                <span
                  className={clsx(
                    "text-xs font-semibold",
                    isDark
                      ? "text-purple-400"
                      : "text-purple-700"
                  )}
                >
                  {src.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={clsx(
                    "h-1.5 w-16 rounded-full overflow-hidden border",
                    isDark
                      ? "bg-purple-950 border-purple-900/30"
                      : "bg-purple-100 border-purple-200"
                  )}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${src.value}%`,
                      background: src.color,
                    }}
                  />
                </div>

                <span
                  className={clsx(
                    "text-xs font-bold w-6 text-right",
                    isDark
                      ? "text-purple-200"
                      : "text-purple-800"
                  )}
                >
                  {src.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}