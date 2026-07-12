import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Bell, Search, Calendar, LogOut, Zap, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import clsx from "clsx";

const initialNotifications = [
  {
    id: 1,
    type: "alert",
    icon: AlertTriangle,
    title: "High consumption detected",
    message: "Meter #SM-1042 exceeded 150% of average usage in Zone B.",
    time: "5 min ago",
    read: false,
  },
  {
    id: 2,
    type: "success",
    icon: CheckCircle,
    title: "Billing cycle completed",
    message: "June 2026 billing has been generated for 324 meters.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    icon: Zap,
    title: "Meter offline",
    message: "Meter #SM-0817 has been unresponsive for 30 minutes.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 4,
    type: "info",
    icon: Info,
    title: "Firmware update available",
    message: "v3.2.1 is ready for deployment across Zone A meters.",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "success",
    icon: CheckCircle,
    title: "Report exported",
    message: "Monthly consumption report has been exported to CSV.",
    time: "Yesterday",
    read: true,
  },
];

const typeColors = {
  alert: { dot: "bg-rose-500 shadow-[0_0_8px_#f43f5e]", iconColor: "text-rose-400", bg: "bg-rose-500/10" },
  warning: { dot: "bg-amber-500 shadow-[0_0_8px_#f59e0b]", iconColor: "text-amber-400", bg: "bg-amber-500/10" },
  success: { dot: "bg-emerald-500 shadow-[0_0_8px_#10b981]", iconColor: "text-emerald-400", bg: "bg-emerald-500/10" },
  info: { dot: "bg-cyan-500 shadow-[0_0_8px_#06b6d4]", iconColor: "text-cyan-400", bg: "bg-cyan-500/10" },
};

export default function Header({ onOpenSearch }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const isDark = theme === "dark";

  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const panelRef = useRef(null);
  const bellRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close panel on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        bellRef.current &&
        !bellRef.current.contains(e.target)
      ) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifOpen]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const getInitials = (name) => {
    if (!name) return "SM";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const now = new Date();
  const formatted = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      className={clsx(
        "flex items-center justify-between px-6 py-4 border-b relative z-30 backdrop-blur-xl",
        isDark
          ? "bg-[#0a0a1a]/80 border-purple-950/40 text-purple-100"
          : "bg-white/80 border-purple-100 text-purple-950"
      )}
    >
      {/* Left: page title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent glow-text-purple">
          Smart Meter Analytics Dashboard
        </h1>

        <div
          className={clsx(
            "flex items-center gap-1.5 text-[11px] font-semibold mt-0.5 tracking-wide",
            isDark ? "text-purple-500/80" : "text-purple-500"
          )}
        >
          <Calendar size={11} className="text-purple-500" />
          <span>{formatted}</span>
        </div>
      </div>

      {/* Right: search + actions */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div
          onClick={onOpenSearch}
          className={clsx(
            "hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all cursor-pointer border",
            isDark
              ? "bg-[#16122b]/55 border-purple-950/60 text-purple-400 hover:bg-[#1a1535] hover:border-purple-800/40"
              : "bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-100"
          )}
        >
          <Search size={14} className="text-purple-500" />
          <span className="text-xs">Search grid, meters, anomalies...</span>

          <kbd
            className={clsx(
              "text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border",
              isDark
                ? "bg-purple-950 border-purple-900 text-purple-400"
                : "bg-white border-purple-200 text-purple-500"
            )}
          >
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            ref={bellRef}
            onClick={() => setNotifOpen(!notifOpen)}
            className={clsx(
              "relative p-2 rounded-xl transition-all border",
              notifOpen
                ? isDark
                  ? "bg-purple-950/80 border-purple-500/40 text-purple-200"
                  : "bg-purple-100 border-purple-300 text-purple-800"
                : isDark
                ? "bg-[#16122b]/40 border-purple-950/50 hover:bg-[#16122b] text-purple-400 hover:text-purple-200 hover:border-purple-800/40"
                : "bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-100"
            )}
            aria-label="Toggle notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_#d946ef] animate-pulse" />
            )}
          </button>

          {/* Notification Panel */}
          {notifOpen && (
            <div
              ref={panelRef}
              className={clsx(
                "absolute right-0 top-full mt-3 w-96 rounded-2xl border shadow-2xl z-50 overflow-hidden backdrop-blur-2xl",
                "animate-in fade-in slide-in-from-top-2 duration-200",
                isDark
                  ? "bg-[#0f0d1a]/95 border-purple-900/50 shadow-black/60"
                  : "bg-white/95 border-purple-200 shadow-purple-100/40"
              )}
              style={{ animation: "notifSlideIn 0.2s ease-out" }}
            >
              {/* Panel Header */}
              <div
                className={clsx(
                  "flex items-center justify-between px-5 py-4 border-b",
                  isDark ? "border-purple-950/60" : "border-purple-100"
                )}
              >
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm tracking-wide bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">Grid Alerts</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30">
                      {unreadCount} active
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                  >
                    Resolve all
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-[380px] overflow-y-auto scrollbar-thin">
                {notifications.map((notif) => {
                  const colors = typeColors[notif.type];
                  const IconComp = notif.icon;
                  return (
                    <button
                      key={notif.id}
                      onClick={() => markRead(notif.id)}
                      className={clsx(
                        "w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors border-b last:border-b-0",
                        isDark ? "border-purple-950/40" : "border-purple-50",
                        !notif.read
                          ? isDark
                            ? "bg-purple-950/20 hover:bg-purple-950/40"
                            : "bg-purple-50/50 hover:bg-purple-50"
                          : isDark
                          ? "hover:bg-purple-950/10"
                          : "hover:bg-purple-50/30"
                      )}
                    >
                      {/* Icon */}
                      <div
                        className={clsx(
                          "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 border border-purple-500/10",
                          colors.bg
                        )}
                      >
                        <IconComp size={15} className={colors.iconColor} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={clsx(
                              "text-sm truncate",
                              !notif.read ? "font-bold text-purple-200" : "font-medium text-purple-400/90",
                              isDark ? "" : "text-purple-950"
                            )}
                          >
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <span className={clsx("flex-shrink-0 w-1.5 h-1.5 rounded-full", colors.dot)} />
                          )}
                        </div>
                        <p
                          className={clsx(
                            "text-xs mt-0.5 line-clamp-2",
                            isDark ? "text-purple-400" : "text-purple-700"
                          )}
                        >
                          {notif.message}
                        </p>
                        <p
                          className={clsx(
                            "text-[10px] mt-1 font-semibold",
                            isDark ? "text-purple-600" : "text-purple-400"
                          )}
                        >
                          {notif.time}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Panel Footer */}
              <div
                className={clsx(
                  "px-5 py-3 border-t text-center",
                  isDark ? "border-purple-950/60" : "border-purple-100"
                )}
              >
                <button
                  className="text-xs text-purple-400 hover:text-purple-300 font-bold tracking-wider uppercase transition-colors"
                >
                  Enter Alert Monitor Center
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all border",
            isDark
              ? "bg-[#16122b]/55 border-purple-950/60 text-fuchsia-400 hover:bg-[#1a1535]"
              : "bg-purple-50 border-purple-100 text-purple-600 hover:bg-purple-100"
          )}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
          <span className="hidden sm:inline">
            {isDark ? "Light Grid" : "Dark Grid"}
          </span>
        </button>

        {/* Avatar */}
        <div 
          className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)] cursor-pointer hover:scale-105 transition-transform"
          title={user?.fullName || "User Profile"}
        >
          {getInitials(user?.fullName)}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className={clsx(
            "p-2 rounded-xl transition-all border",
            isDark
              ? "bg-[#16122b]/40 border-purple-950/50 hover:bg-rose-950/30 text-purple-500 hover:text-rose-400 hover:border-rose-900/30"
              : "bg-purple-50 border-purple-100 text-purple-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200"
          )}
          title="Log Out"
        >
          <LogOut size={18} />
        </button>

      </div>
    </header>
  );
}