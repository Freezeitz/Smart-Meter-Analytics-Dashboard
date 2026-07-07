import {
  Zap,
  Gauge,
  IndianRupee,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { kpiData } from "../data/analyticsData";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

const iconMap = {
  Zap,
  Gauge,
  IndianRupee,
  Activity,
};

const colorMap = {
  brand: {
    bg: "from-sky-500/20 to-sky-500/5",
    text: "text-sky-400",
    line: "#0ea5e9",
  },
  accent: {
    bg: "from-violet-500/20 to-violet-500/5",
    text: "text-violet-400",
    line: "#8b5cf6",
  },
  emerald: {
    bg: "from-emerald-500/20 to-emerald-500/5",
    text: "text-emerald-400",
    line: "#10b981",
  },
  rose: {
    bg: "from-rose-500/20 to-rose-500/5",
    text: "text-rose-400",
    line: "#f43f5e",
  },
};

const lightColorMap = {
  brand: {
    bg: "from-sky-50 to-sky-50",
    text: "text-sky-600",
    line: "#0ea5e9",
  },
  accent: {
    bg: "from-violet-50 to-violet-50",
    text: "text-violet-600",
    line: "#8b5cf6",
  },
  emerald: {
    bg: "from-emerald-50 to-emerald-50",
    text: "text-emerald-600",
    line: "#10b981",
  },
  rose: {
    bg: "from-rose-50 to-rose-50",
    text: "text-rose-600",
    line: "#f43f5e",
  },
};

export default function KPICards() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpiData.map((kpi) => {
        const Icon = iconMap[kpi.icon];
        const colors = isDark
          ? colorMap[kpi.color]
          : lightColorMap[kpi.color];

        const sparkData = kpi.sparkline.map((v, i) => ({ i, v }));
        const isUp = kpi.trend === "up";

        return (
          <div
            key={kpi.id}
            className={clsx(
              "relative overflow-hidden rounded-2xl p-5 border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
              isDark
                ? "bg-slate-800/60 border-slate-700/50 hover:border-slate-600"
                : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
            )}
          >
            {/* Background Glow */}
            <div
              className={clsx(
                "absolute -top-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br opacity-60",
                colors.bg
              )}
            />

            {/* Top Row */}
            <div className="relative flex items-start justify-between mb-3">
              <div
                className={clsx(
                  "w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br border",
                  colors.bg,
                  isDark ? "border-white/5" : "border-white"
                )}
              >
                <Icon size={16} className={colors.text} />
              </div>

              {/* Trend Badge */}
              <div
                className={clsx(
                  "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg",
                  isUp
                    ? isDark
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-emerald-50 text-emerald-600"
                    : isDark
                    ? "bg-rose-500/15 text-rose-400"
                    : "bg-rose-50 text-rose-600"
                )}
              >
                {isUp ? (
                  <ArrowUpRight size={12} />
                ) : (
                  <ArrowDownRight size={12} />
                )}
                {kpi.change}
              </div>
            </div>

            {/* KPI Value */}
            <div className="relative mb-1">
              <p className="text-2xl font-bold tracking-tight">
                {kpi.value}
              </p>

              <p
                className={clsx(
                  "text-xs mt-0.5",
                  isDark ? "text-slate-500" : "text-slate-500"
                )}
              >
                {kpi.label}
              </p>
            </div>

            {/* Sparkline */}
            <div className="relative mt-3 h-10">
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