import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import PlaceholderPage from "./components/PlaceholderPage";
import LoginPage from "./components/LoginPage";
import SearchModal from "./components/SearchModal";
import LogsModal from "./components/LogsModal";
import clsx from "clsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (loading) {
    return (
      <div
        className={clsx(
          "flex items-center justify-center h-screen",
          isDark ? "bg-[#0a0a1a] text-purple-100" : "bg-purple-50 text-purple-950"
        )}
      >
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppShell() {
  const [activeView, setActiveView] = useState("dashboard");
  const [searchOpen, setSearchOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Hotkey Cmd+K or Ctrl+K for search modal trigger
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={clsx(
        "flex h-screen overflow-hidden relative",
        isDark ? "bg-[#0a0a1a] text-purple-100" : "bg-purple-50 text-purple-950"
      )}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40 z-0" />

      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Header onOpenSearch={() => setSearchOpen(true)} />
        <main
          className={clsx(
            "flex-1 overflow-y-auto scrollbar-thin relative",
            isDark ? "bg-[#0a0a1a]/40" : "bg-purple-50/40"
          )}
        >
          {activeView === "dashboard" ? (
            <Dashboard onViewLogs={() => setLogsOpen(true)} />
          ) : (
            <PlaceholderPage viewId={activeView} />
          )}
        </main>
      </div>

      {/* Modal Overlays */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <LogsModal isOpen={logsOpen} onClose={() => setLogsOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
