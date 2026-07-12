import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";
import { Zap, Activity, BarChart3, Bell, FileText, Settings } from "lucide-react";

const pageConfig = {
  meters: {
    icon: Zap,
    title: "Smart Grid Metering",
    subtitle: "Real-time telemetry and mapping database for 324 connected endpoints.",
    color: "from-purple-600 via-purple-550 to-fuchsia-600 shadow-[0_0_20px_rgba(168,85,247,0.3)]",
  },
  consumption: {
    icon: Activity,
    title: "Consumption Telemetry",
    subtitle: "High frequency grid demand curves and zone patterns.",
    color: "from-cyan-600 via-cyan-550 to-purple-600 shadow-[0_0_20px_rgba(6,182,212,0.3)]",
  },
  analytics: {
    icon: BarChart3,
    title: "Quantum Grid Analytics",
    subtitle: "AI-driven predictive demand modeling and grid forecasting.",
    color: "from-purple-600 via-fuchsia-500 to-cyan-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]",
  },
  alerts: {
    icon: Bell,
    title: "Grid Monitor Stream",
    subtitle: "Real-time warning system, phase errors, and security warnings.",
    color: "from-rose-600 via-rose-550 to-purple-600 shadow-[0_0_20px_rgba(251,113,133,0.3)]",
  },
  reports: {
    icon: FileText,
    title: "Export Terminal",
    subtitle: "Structured telemetry compilations, billing records, and audit logs.",
    color: "from-purple-700 via-purple-600 to-fuchsia-600 shadow-[0_0_20px_rgba(168,85,247,0.35)]",
  },
  settings: {
    icon: Settings,
    title: "System Config Node",
    subtitle: "Configure node connections, authorization matrix, and API keys.",
    color: "from-[#1c173a] via-[#231b4b] to-purple-900 shadow-[0_0_20px_rgba(139,92,246,0.15)]",
  },
};

export default function PlaceholderPage({ viewId }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const config = pageConfig[viewId];

  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className="p-6 max-w-[1600px] mx-auto relative z-10">
      <div
        className={clsx(
          "rounded-2xl border overflow-hidden backdrop-blur-md",
          isDark
            ? "bg-[#16122d]/60 border-purple-500/10 shadow-[0_4px_25px_rgba(0,0,0,0.3)]"
            : "bg-white/80 border-purple-100"
        )}
      >
        {/* Hero Banner */}
        <div
          className={clsx(
            "relative px-8 py-12 bg-gradient-to-br border-b",
            config.color,
            isDark ? "border-purple-500/15" : "border-purple-100"
          )}
        >
          <div className="absolute inset-0 bg-[#0a0a1a]/10 pointer-events-none" />
          <div className="relative z-10 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg">
              <Icon size={30} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight glow-text-purple">
                {config.title}
              </h2>
              <p className="text-white/80 text-xs font-bold tracking-wide mt-1 uppercase">
                {config.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="px-8 py-16 text-center">
          <div
            className={clsx(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border",
              isDark
                ? "bg-[#0c0a1a] border-purple-800/40 text-purple-300"
                : "bg-purple-50 border-purple-200 text-purple-700"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-pulse shadow-[0_0_8px_#d946ef]" />
            Initializing Telemetry Subsystem
          </div>

          <p
            className={clsx(
              "text-xs max-w-md mx-auto font-semibold leading-relaxed tracking-wide",
              isDark ? "text-purple-400/90" : "text-purple-700"
            )}
          >
            This dashboard console module is currently loading database connections.
            Please connect verification protocols or inspect system status logs.
          </p>
        </div>
      </div>
    </div>
  );
}
