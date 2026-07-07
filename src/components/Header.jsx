import { Sun, Moon, Bell, Search, Calendar } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

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
        "flex items-center justify-between px-6 py-4 border-b",
        isDark
          ? "bg-slate-900 border-slate-800 text-slate-100"
          : "bg-white border-slate-200 text-slate-800"
      )}
    >
      {/* Left: page title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">
          Smart Meter Analytics Dashboard
        </h1>

        <div
          className={clsx(
            "flex items-center gap-1.5 text-xs mt-0.5",
            isDark ? "text-slate-500" : "text-slate-400"
          )}
        >
          <Calendar size={11} />
          <span>{formatted}</span>
        </div>
      </div>

      {/* Right: search + actions */}
      <div className="flex items-center gap-3">

        {/* Search */}
        <div
          className={clsx(
            "hidden md:flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors",
            isDark
              ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          )}
        >
          <Search size={14} />
          <span>Search meters, alerts...</span>

          <kbd
            className={clsx(
              "text-[10px] px-1.5 py-0.5 rounded font-mono",
              isDark
                ? "bg-slate-700 text-slate-400"
                : "bg-slate-200 text-slate-500"
            )}
          >
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button
          className={clsx(
            "relative p-2 rounded-xl transition-colors",
            isDark
              ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"
          )}
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all",
            isDark
              ? "bg-slate-800 text-amber-400 hover:bg-slate-700"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          )}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
          <span className="hidden sm:inline">
            {isDark ? "Light" : "Dark"}
          </span>
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-md cursor-pointer">
          SM
        </div>

      </div>
    </header>
  );
}