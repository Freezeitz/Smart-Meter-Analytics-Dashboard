import {
  TrendingUp,
  CreditCard,
  AlertTriangle,
  UserPlus,
} from "lucide-react";
import { recentEvents } from "../data/analyticsData";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

const iconMap = {
  TrendingUp,
  CreditCard,
  AlertTriangle,
  UserPlus,
};

const eventColors = {
  usage: {
    bg: "bg-sky-500/15",
    text: "text-sky-400",
  },
  bill: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
  },
  alert: {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
  },
  meter: {
    bg: "bg-violet-500/15",
    text: "text-violet-400",
  },
};

const lightEventColors = {
  usage: {
    bg: "bg-sky-50",
    text: "text-sky-600",
  },
  bill: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  alert: {
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  meter: {
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
};

export default function RecentActivity() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={clsx(
        "rounded-2xl p-5 border",
        isDark
          ? "bg-slate-800/60 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-base">Meter Alerts</h2>
          <p
            className={clsx(
              "text-xs mt-0.5",
              isDark ? "text-slate-500" : "text-slate-400"
            )}
          >
            Real-time monitoring events
          </p>
        </div>

        <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </span>
      </div>

      <div className="space-y-3">
        {recentEvents.map((event) => {
          const Icon = iconMap[event.icon];
          const cols = isDark
            ? eventColors[event.type]
            : lightEventColors[event.type];

          return (
            <div key={event.id} className="flex items-start gap-3">
              <div
                className={clsx(
                  "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                  cols.bg
                )}
              >
                <Icon size={14} className={cols.text} />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={clsx(
                    "text-xs leading-relaxed",
                    isDark ? "text-slate-300" : "text-slate-700"
                  )}
                >
                  {event.message}
                </p>

                <p
                  className={clsx(
                    "text-[10px] mt-0.5",
                    isDark ? "text-slate-600" : "text-slate-400"
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
        className={clsx(
          "w-full mt-4 py-2 rounded-xl text-xs font-medium transition-colors",
          isDark
            ? "bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
            : "bg-slate-50 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
        )}
      >
        View all alerts →
      </button>
    </div>
  );
}