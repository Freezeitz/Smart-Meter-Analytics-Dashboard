import { useState, useEffect, useRef } from "react";
import { Search, Zap, AlertTriangle, ShieldAlert, Cpu, CheckCircle, X } from "lucide-react";
import clsx from "clsx";

const mockMeters = [
  { id: "SM-1042", zone: "Zone B", status: "Active", load: "4.2 kW", location: "Substation Delta" },
  { id: "SM-0817", zone: "Zone A", status: "Offline", load: "0.0 kW", location: "Substation Alpha" },
  { id: "SM-2093", zone: "Zone C", status: "Active", load: "2.1 kW", location: "Substation Gamma" },
  { id: "SM-1104", zone: "Zone B", status: "Warning", load: "7.8 kW", location: "Substation Delta" },
  { id: "SM-3045", zone: "Zone A", status: "Active", load: "1.2 kW", location: "Substation Beta" },
];

const mockActions = [
  { name: "Recalibrate Grid Transmitters", shortcut: "⌥R", icon: Cpu },
  { name: "Clear Active Alert Flags", shortcut: "⌥C", icon: CheckCircle },
  { name: "Trigger Zone A Isolation", shortcut: "⌥I", icon: ShieldAlert, danger: true },
];

export default function SearchModal({ isOpen, onClose, onSelectMeter }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const modalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const filteredMeters = mockMeters.filter(
      (m) =>
        m.id.toLowerCase().includes(q) ||
        m.zone.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q)
    );

    const filteredActions = mockActions.filter((a) =>
      a.name.toLowerCase().includes(q)
    );

    setResults([...filteredMeters, ...filteredActions]);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-start justify-center pt-[10vh] px-4 animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className={clsx(
          "w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-2xl",
          "bg-[#0f0d1a]/95 border-purple-500/30 shadow-purple-500/10",
          "animate-in zoom-in-95 duration-200"
        )}
      >
        {/* Header Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-purple-950/60 relative">
          <Search size={20} className="text-purple-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meters, grid zones, status actions..."
            className="flex-1 bg-transparent border-0 outline-none text-purple-100 text-base placeholder-purple-600/80"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-purple-950/40 text-purple-400 hover:text-purple-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Query Results / Default suggestion */}
        <div className="max-h-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin">
          {query === "" ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-bold text-purple-500 uppercase tracking-widest px-2 mb-2">
                  Recent Smart Meters
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {mockMeters.slice(0, 4).map((meter) => (
                    <button
                      key={meter.id}
                      onClick={() => {
                        alert(`Selected meter ${meter.id} (${meter.zone})`);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-950/15 hover:bg-purple-950/30 border border-purple-950/50 hover:border-purple-800/40 text-left transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform">
                          <Zap size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-purple-200">{meter.id}</p>
                          <p className="text-[10px] text-purple-500 font-semibold">{meter.zone} • {meter.location}</p>
                        </div>
                      </div>
                      <span className={clsx(
                        "text-[9px] font-bold px-2 py-0.5 rounded border",
                        meter.status === "Active" && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                        meter.status === "Offline" && "bg-rose-500/10 border-rose-500/20 text-rose-400",
                        meter.status === "Warning" && "bg-amber-500/10 border-amber-500/20 text-amber-400"
                      )}>
                        {meter.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-purple-500 uppercase tracking-widest px-2 mb-2">
                  System Commands
                </h4>
                <div className="space-y-1">
                  {mockActions.map((action) => {
                    const ActionIcon = action.icon;
                    return (
                      <button
                        key={action.name}
                        onClick={() => {
                          alert(`Command Executed: ${action.name}`);
                          onClose();
                        }}
                        className={clsx(
                          "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all border border-transparent",
                          action.danger
                            ? "hover:bg-rose-950/20 hover:border-rose-900/30 text-rose-400"
                            : "hover:bg-purple-950/20 hover:border-purple-900/30 text-purple-300"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <ActionIcon size={14} className={action.danger ? "text-rose-500" : "text-purple-400"} />
                          <span className="text-xs font-bold">{action.name}</span>
                        </div>
                        <kbd className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-950 border border-purple-900 text-purple-500">
                          {action.shortcut}
                        </kbd>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((res, index) => {
                if (res.id) {
                  // Meter item
                  return (
                    <button
                      key={res.id}
                      onClick={() => {
                        alert(`Selected meter ${res.id}`);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-950/15 hover:bg-purple-950/30 border border-purple-950/50 hover:border-purple-800/40 text-left transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                          <Zap size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-purple-200">{res.id}</p>
                          <p className="text-[10px] text-purple-500 font-semibold">{res.zone} • {res.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-purple-400 font-bold">{res.load}</span>
                        <span className={clsx(
                          "text-[9px] font-bold px-2 py-0.5 rounded border",
                          res.status === "Active" && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                          res.status === "Offline" && "bg-rose-500/10 border-rose-500/20 text-rose-400",
                          res.status === "Warning" && "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        )}>
                          {res.status}
                        </span>
                      </div>
                    </button>
                  );
                } else {
                  // Action item
                  const ActionIcon = res.icon;
                  return (
                    <button
                      key={res.name}
                      onClick={() => {
                        alert(`Command Executed: ${res.name}`);
                        onClose();
                      }}
                      className={clsx(
                        "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all border border-transparent",
                        res.danger
                          ? "hover:bg-rose-950/20 hover:border-rose-900/30 text-rose-400"
                          : "hover:bg-purple-950/20 hover:border-purple-900/30 text-purple-300"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <ActionIcon size={14} className={res.danger ? "text-rose-500" : "text-purple-400"} />
                        <span className="text-xs font-bold">{res.name}</span>
                      </div>
                      <kbd className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-950 border border-purple-900 text-purple-500">
                        {res.shortcut}
                      </kbd>
                    </button>
                  );
                }
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle size={24} className="mx-auto text-purple-500 mb-2" />
              <p className="text-xs font-bold text-purple-400">No match found for "{query}"</p>
              <p className="text-[10px] text-purple-600 mt-1 font-semibold">Inspect your query syntax or search zone variables.</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3.5 border-t border-purple-950/60 flex items-center justify-between text-[10px] font-bold text-purple-500">
          <div className="flex items-center gap-4">
            <span><kbd className="bg-purple-950 border border-purple-900 px-1 py-0.5 rounded">↑↓</kbd> Select</span>
            <span><kbd className="bg-purple-950 border border-purple-900 px-1 py-0.5 rounded">⏎</kbd> Confirm</span>
          </div>
          <span>Esc to Close</span>
        </div>
      </div>
    </div>
  );
}
