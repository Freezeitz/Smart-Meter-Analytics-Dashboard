import { useState, useEffect } from "react";
import {
  Zap,
  Gauge,
  IndianRupee,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { kpiData as fallbackKpiData } from "../data/analyticsData";
import { useTheme } from "../context/ThemeContext";
import { dashboardAPI } from "../services/api";
import clsx from "clsx";

const iconMap = {
  Zap,
  Gauge,
  IndianRupee,
  Activity,
};

const colorMap = {
  brand: {
    bg: "from-purple-500/20 to-purple-500/5",
    text: "text-purple-400",
    line: "#a855f7",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.12)]",
    border: "border-purple-500/25 hover:border-purple-500/50",
  },
  accent: {
    bg: "from-cyan-500/20 to-cyan-500/5",
    text: "text-cyan-400",
    line: "#06b6d4",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.12)]",
    border: "border-cyan-500/25 hover:border-cyan-500/50",
  },
  emerald: {
    bg: "from-fuchsia-500/20 to-fuchsia-500/5",
    text: "text-fuchsia-400",
    line: "#ec4899",
    glow: "shadow-[0_0_15px_rgba(236,72,153,0.12)]",
    border: "border-fuchsia-500/25 hover:border-fuchsia-500/50",
  },
  rose: {
    bg: "from-rose-500/20 to-rose-500/5",
    text: "text-rose-400",
    line: "#fb7185",
    glow: "shadow-[0_0_15px_rgba(251,113,133,0.12)]",
    border: "border-rose-500/25 hover:border-rose-500/50",
  },
};

const lightColorMap = {
  brand: {
    bg: "from-purple-50 to-purple-50",
    text: "text-purple-600",
    line: "#a855f7",
    glow: "",
    border: "border-purple-200 hover:border-purple-300",
  },
  accent: {
    bg: "from-cyan-50 to-cyan-50",
    text: "text-cyan-600",
    line: "#06b6d4",
    glow: "",
    border: "border-cyan-200 hover:border-cyan-300",
  },
  emerald: {
    bg: "from-fuchsia-50 to-fuchsia-50",
    text: "text-fuchsia-600",
    line: "#ec4899",
    glow: "",
    border: "border-fuchsia-200 hover:border-fuchsia-300",
  },
  rose: {
    bg: "from-rose-50 to-rose-50",
    text: "text-rose-600",
    line: "#fb7185",
    glow: "",
    border: "border-rose-200 hover:border-rose-300",
  },
};

export default function KPICards() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState(fallbackKpiData);

  useEffect(() => {
    dashboardAPI.getKpiData()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setData(res.data);
        }
      })
      .catch(err => {
        console.warn("Could not fetch KPI data from API, using fallback data:", err);
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
    const rotateY = ((x - centerX) / centerX) * 8; // Max 8 degree tilt
    const rotateX = -((y - centerY) / centerY) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.boxShadow = isDark
      ? "0 20px 30px rgba(168, 85, 247, 0.25), 0 0 15px rgba(168, 85, 247, 0.15)"
      : "0 15px 25px rgba(168, 85, 247, 0.1)";
  };

  const handleMouseLeave3D = (e) => {
    const card = e.currentTarget;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    card.style.boxShadow = "";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {data.map((kpi) => {
        const Icon = iconMap[kpi.icon];
        const colors = isDark
          ? colorMap[kpi.color]
          : lightColorMap[kpi.color];

        const sparkData = kpi.sparkline.map((v, i) => ({ i, v }));
        const isUp = kpi.trend === "up";

        return (
          <div
            key={kpi.id}
            onMouseMove={handleMouseMove3D}
            onMouseLeave={handleMouseLeave3D}
            className={clsx(
              "relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 ease-out backdrop-blur-md cursor-pointer select-none",
              isDark
                ? "bg-[#16122d]/60 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                : "bg-white/80 shadow-sm",
              colors.border,
              colors.glow
            )}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Background Glow */}
            <div
              className={clsx(
                "absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br opacity-50 blur-xl pointer-events-none"
              )}
              style={{ transform: "translateZ(30px)" }}
            />

            {/* Top Row */}
            <div className="relative flex items-start justify-between mb-3" style={{ transform: "translateZ(20px)" }}>
              <div
                className={clsx(
                  "w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br border",
                  colors.bg,
                  isDark ? "border-purple-500/10" : "border-white"
                )}
              >
                <Icon size={16} className={colors.text} />
              </div>

              {/* Trend Badge */}
              <div
                className={clsx(
                  "flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border",
                  isUp
                    ? isDark
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "bg-emerald-50 border-emerald-200 text-emerald-600"
                    : isDark
                    ? "bg-rose-500/15 border-rose-500/30 text-rose-400"
                    : "bg-rose-50 border-rose-200 text-rose-600"
                )}
              >
                {isUp ? (
                  <ArrowUpRight size={11} />
                ) : (
                  <ArrowDownRight size={11} />
                )}
                {kpi.change}
              </div>
            </div>

            {/* KPI Value */}
            <div className="relative mb-1" style={{ transform: "translateZ(25px)" }}>
              <p className={clsx(
                "text-2xl font-black tracking-tight",
                isDark ? "text-purple-100" : "text-purple-950"
              )}>
                {kpi.value}
              </p>

              <p
                className={clsx(
                  "text-[11px] font-bold uppercase tracking-wider",
                  isDark ? "text-purple-500/80" : "text-purple-400"
                )}
              >
                {kpi.label}
              </p>
            </div>

            {/* Sparkline */}
            <div className="relative mt-4 h-10" style={{ transform: "translateZ(15px)" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparkData}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke={colors.line}
                    strokeWidth={2}
                    dot={false}
                    strokeLinecap="round"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}