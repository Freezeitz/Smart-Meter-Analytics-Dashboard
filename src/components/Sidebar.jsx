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
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Zap, label: "Meters", badge: "324" },
  { icon: Activity, label: "Consumption", badge: null },
  { icon: BarChart3, label: "Analytics", badge: null },
  { icon: Bell, label: "Alerts", badge: "3" },
  { icon: FileText, label: "Reports", badge: null },
  { icon: Settings, label: "Settings", badge: null },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside
      className={clsx(
        "relative flex flex-col h-screen transition-all duration-300 ease-in-out border-r z-10",
        collapsed ? "w-16" : "w-60",
        isDark
          ? "bg-slate-900 border-slate-800 text-slate-100"
          : "bg-white border-slate-200 text-slate-800"
      )}
    >
      {/* Logo */}
      <div
        className={clsx(
          "flex items-center gap-3 px-4 py-5 border-b",
          isDark ? "border-slate-800" : "border-slate-100"
        )}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-violet-600 flex items-center justify-center shadow-lg">
          <Zap size={16} className="text-white" />
        </div>

        {!collapsed && (
          <div>
            <span className="font-bold text-sm tracking-wide">
              SmartGrid Analytics
            </span>

            <p
              className={clsx(
                "text-[10px]",
                isDark ? "text-slate-500" : "text-slate-400"
              )}
            >
              Smart Meter Dashboard
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ icon: Icon, label, active, badge }) => (
          <button
            key={label}
            className={clsx(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left group",
              active
                ? "bg-gradient-to-r from-sky-500/20 to-violet-500/10 text-sky-400 font-medium"
                : isDark
                ? "hover:bg-slate-800 text-slate-400 hover:text-slate-100"
                : "hover:bg-slate-100 text-slate-500 hover:text-slate-800"
            )}
          >
            <Icon
              size={18}
              className={clsx(
                "flex-shrink-0 transition-transform group-hover:scale-110",
                active ? "text-sky-400" : ""
              )}
            />

            {!collapsed && (
              <>
                <span className="flex-1 text-sm">{label}</span>

                {badge && (
                  <span
                    className={clsx(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                      active
                        ? "bg-sky-500 text-white"
                        : isDark
                        ? "bg-slate-700 text-slate-300"
                        : "bg-slate-200 text-slate-600"
                    )}
                  >
                    {badge}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div
        className={clsx(
          "p-3 border-t",
          isDark ? "border-slate-800" : "border-slate-100"
        )}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={clsx(
            "w-full flex items-center justify-center py-2 rounded-xl transition-colors text-sm gap-2",
            isDark
              ? "hover:bg-slate-800 text-slate-500 hover:text-slate-300"
              : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          )}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}

          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}