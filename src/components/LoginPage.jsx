import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, ArrowRight, UserPlus, LogIn, Mail, User, Lock, Loader2, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const { login, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setUsername('');
    setPassword('');
    setEmail('');
    setFullName('');
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password || (!isLogin && (!email || !fullName))) {
      setError('Please fill in all fields.');
      setLoading(false);
      triggerShake();
      return;
    }

    try {
      let result;
      if (isLogin) {
        result = await login(username, password);
      } else {
        result = await register(username, email, password, fullName);
      }

      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Authentication failed');
        triggerShake();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={clsx(
        "relative min-h-screen flex items-center justify-center p-4 overflow-hidden transition-colors duration-500 scanline",
        isDark 
          ? "bg-[#0a0a1a] text-purple-100" 
          : "bg-purple-50 text-purple-950"
      )}
    >
      {/* Animated Grid Background */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-30 z-0" />

      {/* CSS Animations */}
      <style>{`
        @keyframes float-blob {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.08); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-float-blob {
          animation: float-blob 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>

      {/* Floating Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div 
          className={clsx(
            "absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[110px] animate-float-blob",
            isDark ? "bg-purple-600/20" : "bg-purple-200/50"
          )} 
        />
        <div 
          className={clsx(
            "absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[110px] animate-float-blob",
            isDark ? "bg-fuchsia-600/20" : "bg-fuchsia-200/50"
          )} 
          style={{ animationDelay: '2s' }}
        />
        <div 
          className={clsx(
            "absolute top-1/2 left-1/3 w-72 h-72 rounded-full blur-[130px] animate-pulse-slow bg-cyan-500/10"
          )} 
          style={{ animationDelay: '1s' }}
        />
      </div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={clsx(
          "absolute top-6 right-6 p-3 rounded-xl transition-all shadow-lg backdrop-blur-md border z-10 cursor-pointer",
          isDark 
            ? "bg-[#16122d]/40 border-purple-900/40 text-fuchsia-400 hover:bg-[#1c173a]" 
            : "bg-white/60 border-purple-200 text-purple-600 hover:bg-purple-50"
        )}
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Login Card */}
      <div
        className={clsx(
          "relative w-full max-w-md rounded-3xl p-8 backdrop-blur-2xl border transition-all duration-300 shadow-2xl z-10",
          shake && "animate-shake",
          isDark 
            ? "bg-[#130f24]/85 border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.15)]" 
            : "bg-white/95 border-purple-200 shadow-purple-100/60"
        )}
      >
        {/* Glow behind card */}
        <div 
          className={clsx(
            "absolute -inset-px rounded-3xl -z-10 bg-gradient-to-br opacity-0 transition-opacity duration-500",
            isDark 
              ? "from-purple-500/10 to-fuchsia-500/10 group-hover:opacity-100" 
              : "from-purple-100 to-fuchsia-100 group-hover:opacity-100"
          )}
        />

        {/* Logo / Title Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] mb-4 animate-float-blob">
            <Zap size={28} className="text-white" />
          </div>

          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent glow-text-purple">
            SmartGrid Analytics
          </h1>
          <p className={clsx("text-xs mt-1 font-bold tracking-wide uppercase", isDark ? "text-purple-500" : "text-purple-600")}>
            {isLogin ? "Authorized Personnel Portal" : "Register Access Credentials"}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name (Register Only) */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className={clsx("text-xs font-bold uppercase tracking-wider", isDark ? "text-purple-400" : "text-purple-600")}>
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className={clsx(
                    "w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2",
                    isDark 
                      ? "bg-[#0c0a18] border-purple-950/60 text-purple-200 focus:border-purple-500/60 focus:ring-purple-500/20" 
                      : "bg-purple-50 border-purple-200 text-purple-900 focus:border-purple-500 focus:ring-purple-200"
                  )}
                />
              </div>
            </div>
          )}

          {/* Email (Register Only) */}
          {!isLogin && (
            <div className="space-y-1.5">
              <label className={clsx("text-xs font-bold uppercase tracking-wider", isDark ? "text-purple-400" : "text-purple-600")}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className={clsx(
                    "w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2",
                    isDark 
                      ? "bg-[#0c0a18] border-purple-950/60 text-purple-200 focus:border-purple-500/60 focus:ring-purple-500/20" 
                      : "bg-purple-50 border-purple-200 text-purple-900 focus:border-purple-500 focus:ring-purple-200"
                  )}
                />
              </div>
            </div>
          )}

          {/* Username */}
          <div className="space-y-1.5">
            <label className={clsx("text-xs font-bold uppercase tracking-wider", isDark ? "text-purple-400" : "text-purple-600")}>
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                <User size={16} />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className={clsx(
                  "w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2",
                  isDark 
                    ? "bg-[#0c0a18] border-purple-950/60 text-purple-200 focus:border-purple-500/60 focus:ring-purple-500/20" 
                    : "bg-purple-50 border-purple-200 text-purple-900 focus:border-purple-500 focus:ring-purple-200"
                )}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className={clsx("text-xs font-bold uppercase tracking-wider", isDark ? "text-purple-400" : "text-purple-600")}>
                Password
              </label>
              {isLogin && (
                <a href="#forgot" className="text-[10px] font-bold text-fuchsia-400 hover:text-fuchsia-300 hover:underline">
                  Forgot Password?
                </a>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-500">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={clsx(
                  "w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2",
                  isDark 
                    ? "bg-[#0c0a18] border-purple-950/60 text-purple-200 focus:border-purple-500/60 focus:ring-purple-500/20" 
                    : "bg-purple-50 border-purple-200 text-purple-900 focus:border-purple-500 focus:ring-purple-200"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-purple-500 hover:text-purple-300 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={clsx(
              "w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-650 via-purple-550 to-fuchsia-600 text-white font-extrabold text-sm tracking-wide uppercase transition-all hover:opacity-95 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] border border-purple-500/10",
              loading && "opacity-80 pointer-events-none"
            )}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isLogin ? (
              <>
                <LogIn size={16} />
                <span>Initialize Console</span>
                <ArrowRight size={14} />
              </>
            ) : (
              <>
                <UserPlus size={16} />
                <span>Register Identity</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Footer / Toggle Mode */}
        <div className="mt-6 pt-5 border-t border-purple-900/10 text-center">
          <p className={clsx("text-xs font-semibold", isDark ? "text-purple-500" : "text-purple-400")}>
            {isLogin ? "New user interface detected?" : "Existing user profile mapped?"}
            <button
              onClick={handleToggleMode}
              className="ml-1.5 font-bold text-fuchsia-400 hover:text-fuchsia-300 transition-colors focus:outline-none cursor-pointer"
            >
              {isLogin ? "Generate Terminal Access" : "Secure Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
