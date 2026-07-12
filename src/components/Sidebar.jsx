import { useState } from "react";
import {
  LayoutDashboard,
  Activity,
  Zap,
  Bell,
  BarChart3,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard", badge: null },
  { icon: Zap, label: "Meters", id: "meters", badge: "324" },
  { icon: Activity, label: "Consumption", id: "consumption", badge: null },
  { icon: BarChart3, label: "Analytics", id: "analytics", badge: null },
  { icon: Bell, label: "Alerts", id: "alerts", badge: "3" },
  { icon: FileText, label: "Reports", id: "reports", badge: null },
  { icon: Settings, label: "Settings", id: "settings", badge: null },
];

export default function Sidebar({ activeView, onNavigate }) {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside
      className={clsx(
        "relative flex flex-col h-screen transition-all duration-300 ease-in-out border-r z-20 backdrop-blur-xl",
        collapsed ? "w-16" : "w-60",
        isDark
          ? "bg-[#0f0d1a]/85 border-purple-950/40 text-purple-100"
          : "bg-white/90 border-purple-100 text-purple-950 shadow-sm"
      )}
    >
      {/* Glow highlight */}
      {isDark && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent pointer-events-none" />
      )}

      {/* Logo */}
      <div
        className={clsx(
          "flex items-center gap-3 px-4 py-5 border-b",
          isDark ? "border-purple-950/40" : "border-purple-100"
        )}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)]">
          <Zap size={16} className="text-white" />
        </div>

        {!collapsed && (
          <div>
            <span className="font-bold text-sm tracking-wide bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent glow-text-purple">
              SmartGrid Analytics
            </span>

            <p
              className={clsx(
                "text-[10px] font-semibold tracking-wider uppercase",
                isDark ? "text-purple-500/80" : "text-purple-400"
              )}
            >
              Smart Meter Grid
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1.5 overflow-y-auto scrollbar-thin">
        {navItems.map(({ icon: Icon, label, id, badge }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group relative",
                isActive
                  ? isDark
                    ? "bg-purple-500/15 text-purple-300 font-semibold border-l-[3px] border-purple-500 shadow-[inset_0_0_15px_rgba(168,85,247,0.1)]"
                    : "bg-purple-100 text-purple-800 font-semibold border-l-[3px] border-purple-600"
                  : isDark
                  ? "hover:bg-purple-950/30 text-purple-400 hover:text-purple-200 hover:shadow-[0_0_8px_rgba(168,85,247,0.05)]"
                  : "hover:bg-purple-50 text-purple-600 hover:text-purple-900"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon
                size={18}
                className={clsx(
                  "flex-shrink-0 transition-transform group-hover:scale-110",
                  isActive
                    ? isDark
                      ? "text-purple-400 filter drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]"
                      : "text-purple-600"
                    : isDark
                    ? "text-purple-500"
                    : "text-purple-400"
                )}
              />

              {!collapsed && (
                <>
                  <span className="flex-1 text-sm tracking-wide">{label}</span>

                  {badge && (
                    <span
                      className={clsx(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full transition-all duration-300",
                        isActive
                          ? isDark
                            ? "bg-fuchsia-500 text-white shadow-[0_0_8px_rgba(236,72,153,0.6)]"
                            : "bg-purple-600 text-white"
                          : isDark
                          ? "bg-purple-950 text-purple-300 border border-purple-800/40"
                          : "bg-purple-100 text-purple-700"
                      )}
                    >
                      {badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div
        className={clsx(
          "p-3 border-t",
          isDark ? "border-purple-950/40" : "border-purple-100"
        )}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            "w-full flex items-center justify-center py-2 rounded-xl transition-all duration-200 text-sm gap-2 font-medium cursor-pointer",
            isDark
              ? "hover:bg-purple-950/30 text-purple-500 hover:text-purple-300"
              : "hover:bg-purple-50 text-purple-500 hover:text-purple-700"
          )}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}

          {!collapsed && <span>Collapse Menu</span>}
        </button>
      </div>
    </aside>
  );
}