import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import clsx from "clsx";

function AppShell() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={clsx(
        "flex h-screen overflow-hidden",
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      )}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main
          className={clsx(
            "flex-1 overflow-y-auto scrollbar-thin",
            isDark ? "bg-slate-950" : "bg-slate-50"
          )}
        >
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  );
}
