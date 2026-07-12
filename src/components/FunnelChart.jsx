import { useState, useEffect } from "react";
import { funnelData as fallbackFunnelData } from "../data/analyticsData";
import { useTheme } from "../context/ThemeContext";
import { dashboardAPI } from "../services/api";
import clsx from "clsx";

const colors = ["#a855f7", "#c084fc", "#d946ef", "#ec4899", "#06b6d4"];
const darkColors = ["#7e22ce", "#9333ea", "#a855f7", "#c084fc", "#0891b2"];

export default function FunnelChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState(fallbackFunnelData);

  useEffect(() => {
    dashboardAPI.getEnergyFlowData()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setData(res.data);
        }
      })
      .catch(err => {
        console.warn("Could not fetch energy flow data, using fallback:", err);
      });
  }, []);

  const max = data.length > 0 ? data[0].count : 1;

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
      {/* Header */}
      <div className="mb-5" style={{ transform: "translateZ(20px)" }}>
        <h2 className="font-bold text-base tracking-wide bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Grid Distribution Efficiency</h2>
        <p
          className={clsx(
            "text-xs mt-0.5 font-medium",
            isDark ? "text-purple-500/80" : "text-purple-400"
          )}
        >
          Generation → Transmission Substation → Smart Meter Billing
        </p>
      </div>

      {/* Funnel */}
      <div className="space-y-2" style={{ transform: "translateZ(10px)" }}>
        {data.map((item, idx) => {
          const widthPct = (item.count / max) * 100;
          const color = isDark ? colors[idx] : darkColors[idx];

          return (
            <div key={item.stage} className="group">
              <div className="flex items-center justify-between mb-1">
                <span
                  className={clsx(
                    "text-xs font-bold",
                    isDark ? "text-purple-300" : "text-purple-700"
                  )}
                >
                  {item.stage}
                </span>

                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      "text-[11px] font-semibold",
                      isDark ? "text-purple-500" : "text-purple-400"
                    )}
                  >
                    {item.pct}%
                  </span>

                  <span
                    className={clsx(
                      "text-xs font-extrabold",
                      isDark ? "text-purple-200" : "text-purple-800"
                    )}
                  >
                    {item.count.toLocaleString()} kW
                  </span>
                </div>
              </div>

              <div
                className={clsx(
                  "h-7 rounded-lg overflow-hidden flex items-center border",
                  isDark ? "bg-[#0c0a1a] border-purple-950/40" : "bg-purple-50 border-purple-100"
                )}
              >
                <div
                  className="h-full rounded-lg flex items-center px-3 transition-all duration-700 ease-out relative"
                  style={{
                    width: `${widthPct}%`,
                    background: `linear-gradient(90deg, ${color}dd, ${color})`,
                    boxShadow: isDark ? `0 0 15px ${color}44` : "none",
                  }}
                >
                  {/* Digital glow overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:15px_15px] opacity-10" />

                  {widthPct > 20 && (
                    <span className="text-white text-[10px] font-bold tracking-wider relative z-10">
                      {item.count.toLocaleString()} kW
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
          "mt-4 flex items-center justify-between p-3 rounded-xl border",
          isDark ? "bg-[#0c0a1a]/60 border-purple-950/40" : "bg-purple-50 border-purple-100"
        )}
        style={{ transform: "translateZ(15px)" }}
      >
        <div>
          <p
            className={clsx(
              "text-[10px] uppercase tracking-wider font-bold",
              isDark ? "text-purple-500" : "text-purple-400"
            )}
          >
            Billing Accuracy Ratio
          </p>
          <p className="text-xl font-black text-fuchsia-400 mt-0.5 glow-text-purple">
            98.6%
          </p>
        </div>

        <div className="text-right">
          <p
            className={clsx(
              "text-[10px] uppercase tracking-wider font-bold",
              isDark ? "text-purple-500" : "text-purple-400"
            )}
          >
            Grid Line Loss
          </p>
          <p className="text-xl font-black text-cyan-400 mt-0.5">
            2.4%
          </p>
        </div>
      </div>
    </div>
  );
}