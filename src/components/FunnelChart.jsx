import { funnelData } from "../data/analyticsData";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

const colors = ["#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd", "#e0f2fe"];
const darkColors = ["#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e"];

export default function FunnelChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const max = funnelData[0].count;

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
        <h2 className="font-bold text-base">Energy Distribution Flow</h2>
        <p
          className={clsx(
            "text-xs mt-0.5",
            isDark ? "text-slate-500" : "text-slate-400"
          )}
        >
          Generation → Transmission → Billing
        </p>
      </div>

      {/* Funnel */}
      <div className="space-y-2">
        {funnelData.map((item, idx) => {
          const widthPct = (item.count / max) * 100;
          const color = isDark ? colors[idx] : darkColors[idx];

          return (
            <div key={item.stage} className="group">
              <div className="flex items-center justify-between mb-1">
                <span
                  className={clsx(
                    "text-xs font-medium",
                    isDark ? "text-slate-300" : "text-slate-600"
                  )}
                >
                  {item.stage}
                </span>

                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      "text-xs",
                      isDark ? "text-slate-500" : "text-slate-400"
                    )}
                  >
                    {item.pct}%
                  </span>

                  <span
                    className={clsx(
                      "text-xs font-semibold",
                      isDark ? "text-slate-200" : "text-slate-700"
                    )}
                  >
                    {item.count.toLocaleString()}
                  </span>
                </div>
              </div>

              <div
                className={clsx(
                  "h-7 rounded-lg overflow-hidden flex items-center",
                  isDark ? "bg-slate-900" : "bg-slate-100"
                )}
              >
                <div
                  className="h-full rounded-lg flex items-center px-2 transition-all duration-700 ease-out"
                  style={{
                    width: `${widthPct}%`,
                    background: color,
                    opacity: isDark ? 0.85 - idx * 0.05 : 1,
                  }}
                >
                  {widthPct > 20 && (
                    <span className="text-white text-[10px] font-semibold truncate">
                      {item.count.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div
        className={clsx(
          "mt-4 flex items-center justify-between p-3 rounded-xl",
          isDark ? "bg-slate-900/60" : "bg-slate-50"
        )}
      >
        <div>
          <p
            className={clsx(
              "text-[10px] uppercase tracking-wider font-semibold",
              isDark ? "text-slate-500" : "text-slate-400"
            )}
          >
            Billing Efficiency
          </p>
          <p className="text-xl font-bold text-sky-400 mt-0.5">
            82%
          </p>
        </div>

        <div className="text-right">
          <p
            className={clsx(
              "text-[10px] uppercase tracking-wider font-semibold",
              isDark ? "text-slate-500" : "text-slate-400"
            )}
          >
            Transmission Loss
          </p>
          <p className="text-xl font-bold text-violet-400 mt-0.5">
            8%
          </p>
        </div>
      </div>
    </div>
  );
}