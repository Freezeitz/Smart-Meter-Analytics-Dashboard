import { useState, useEffect } from "react";
import {
  TrendingUp,
  CreditCard,
  AlertTriangle,
  UserPlus,
} from "lucide-react";
import { recentEvents as fallbackRecentEvents } from "../data/analyticsData";
import { useTheme } from "../context/ThemeContext";
import { dashboardAPI } from "../services/api";
import clsx from "clsx";

const iconMap = {
  TrendingUp,
  CreditCard,
  AlertTriangle,
  UserPlus,
};

const eventColors = {
  usage: {
    bg: "bg-cyan-500/15 border-cyan-500/30",
    text: "text-cyan-400",
  },
  bill: {
    bg: "bg-fuchsia-500/15 border-fuchsia-500/30",
    text: "text-fuchsia-400",
  },
  alert: {
    bg: "bg-rose-500/15 border-rose-500/30",
    text: "text-rose-400",
  },
  meter: {
    bg: "bg-purple-500/15 border-purple-500/30",
    text: "text-purple-400",
  },
};

const lightEventColors = {
  usage: {
    bg: "bg-cyan-50 border-cyan-200",
    text: "text-cyan-600",
  },
  bill: {
    bg: "bg-fuchsia-50 border-fuchsia-200",
    text: "text-fuchsia-600",
  },
  alert: {
    bg: "bg-rose-50 border-rose-200",
    text: "text-rose-600",
  },
  meter: {
    bg: "bg-purple-50 border-purple-200",
    text: "text-purple-600",
  },
};

export default function RecentActivity({ onViewLogs }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState(fallbackRecentEvents);

  useEffect(() => {
    dashboardAPI.getAlerts()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setData(res.data);
        }
      })
      .catch(err => {
        console.warn("Could not fetch alerts, using fallback:", err);
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
      <div className="flex items-center justify-between mb-4" style={{ transform: "translateZ(20px)" }}>
        <div>
          <h2 className="font-bold text-base tracking-wide bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Smart Alert Logs</h2>
          <p
            className={clsx(
              "text-xs mt-0.5 font-medium",
              isDark ? "text-purple-500/80" : "text-purple-400"
            )}
          >
            Real-time anomaly monitoring stream
          </p>
        </div>

        <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full bg-cyan-500/5 shadow-[0_0_8px_rgba(6,182,212,0.2)] animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          GRID LIVE
        </span>
      </div>

      <div className="space-y-3" style={{ transform: "translateZ(10px)" }}>
        {data.map((event) => {
          const Icon = iconMap[event.icon];
          const cols = isDark
            ? eventColors[event.type]
            : lightEventColors[event.type];

          return (
            <div key={event.id} className="flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-purple-500/5 hover:bg-purple-950/5 transition-all">
              <div
                className={clsx(
                  "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 border",
                  cols.bg
                )}
              >
                <Icon size={14} className={cols.text} />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={clsx(
                    "text-xs font-semibold leading-relaxed",
                    isDark ? "text-purple-200" : "text-purple-800"
                  )}
                >
                  {event.message}
                </p>

                <p
                  className={clsx(
                    "text-[10px] font-bold mt-0.5",
                    isDark ? "text-purple-600" : "text-purple-400"
                  )}
                >
                  {event.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onViewLogs}
        className={clsx(
          "w-full mt-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer active:scale-[0.99]",
          isDark
            ? "bg-[#0c0a1a] border-purple-900/40 text-purple-400 hover:text-purple-200 hover:bg-purple-950/20 hover:border-purple-500/20"
            : "bg-purple-50 border-purple-100 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
        )}
        style={{ transform: "translateZ(15px)" }}
      >
        View Full System Logs →
      </button>
    </div>
  );
}