import { useState, useEffect, useRef } from "react";
import { X, Search, Terminal, AlertTriangle, ShieldAlert, Cpu, CheckCircle, RefreshCw, Download } from "lucide-react";
import clsx from "clsx";

const mockLogEntries = [
  { timestamp: "2026-07-13 01:26:01", level: "INFO", source: "GRID_CONTROLLER", message: "Recalibrated substation Delta voltage load balancing factor to 0.982." },
  { timestamp: "2026-07-13 01:25:44", level: "WARN", source: "METER_MANAGER", message: "Meter #SM-1104 exceeded warning target threshold (current load: 7.8 kW)." },
  { timestamp: "2026-07-13 01:25:12", level: "INFO", source: "AUTH_SERVICE", message: "Established connection console user identity 'admin' from IP 192.168.1.104." },
  { timestamp: "2026-07-13 01:24:39", level: "ERROR", source: "ZONE_MONITOR", message: "Phase sync anomaly detected on Zone B grid node. Triggering warning flag." },
  { timestamp: "2026-07-13 01:23:55", level: "INFO", source: "GRID_CONTROLLER", message: "Dispatched nightly transmission reports payload to grid billing node." },
  { timestamp: "2026-07-13 01:22:18", level: "WARN", source: "SUBSTATION_BETA", message: "Temperature anomaly on transformer coil B12. Logging 68.4°C." },
  { timestamp: "2026-07-13 01:21:05", level: "INFO", source: "METER_MANAGER", message: "Registered new identity credentials for meter #SM-3045." },
  { timestamp: "2026-07-13 01:19:44", level: "SUCCESS", source: "GRID_CONTROLLER", message: "Grid health assessment: nominal parameters across all 3 zones." },
  { timestamp: "2026-07-13 01:17:33", level: "ERROR", source: "ZONE_MONITOR", message: "Failed telemetry handshakes with meter #SM-0817. Marking node Offline." },
];

export default function LogsModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState(mockLogEntries);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [isSimulating, setIsSimulating] = useState(true);
  const terminalEndRef = useRef(null);

  // Scroll to bottom when logs load/update
  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, logs]);

  // Simulate incoming live telemetry logs
  useEffect(() => {
    if (!isSimulating || !isOpen) return;

    const interval = setInterval(() => {
      const sources = ["GRID_CONTROLLER", "METER_MANAGER", "ZONE_MONITOR", "AUTH_SERVICE", "SUBSTATION_ALPHA"];
      const levels = ["INFO", "WARN", "ERROR", "SUCCESS"];
      const messages = [
        "Completed telemetry polling cycles for substation nodes.",
        "Refreshed grid balancing load factor configurations.",
        "Recalibrating power transmission factor offsets.",
        "Received load request updates from Zone A grid sector.",
        "Dispatched security handshake queries to active meters.",
      ];

      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const randomLevel = levels[Math.floor(Math.random() * levels.length)];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];

      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

      const newEntry = {
        timestamp: timeStr,
        level: randomLevel,
        source: randomSource,
        message: randomMsg,
      };

      setLogs((prev) => [newEntry, ...prev.slice(0, 49)]); // Keep last 50
    }, 4500);

    return () => clearInterval(interval);
  }, [isSimulating, isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.source.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = levelFilter === "ALL" || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className={clsx(
          "w-full max-w-4xl h-[80vh] rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-2xl flex flex-col",
          "bg-[#0a0814]/95 border-purple-500/30 shadow-purple-500/10",
          "animate-in zoom-in-95 duration-200"
        )}
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-purple-950/60 bg-[#0f0d1a]/80">
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-purple-400" />
            <h3 className="font-bold text-sm tracking-wide text-purple-100">
              System Telemetry Shell • logs.console
            </h3>
            <span className="flex items-center gap-1.5 text-[9px] font-bold border border-cyan-500/30 px-2 py-0.5 rounded-full bg-cyan-500/5 text-cyan-400">
              <span className={clsx("w-1.5 h-1.5 rounded-full bg-cyan-400", isSimulating && "animate-pulse")} />
              {isSimulating ? "SIMULATION ACTIVE" : "PAUSED"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={clsx(
                "p-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                isSimulating
                  ? "bg-purple-950/20 border-purple-800/40 text-purple-300 hover:bg-purple-950/40"
                  : "bg-cyan-950/20 border-cyan-800/40 text-cyan-300 hover:bg-cyan-950/40"
              )}
            >
              <RefreshCw size={12} className={clsx(isSimulating && "animate-spin")} />
              {isSimulating ? "Pause Feed" : "Resume Feed"}
            </button>

            <button
              onClick={() => {
                const text = logs.map(l => `[${l.timestamp}] [${l.level}] [${l.source}] ${l.message}`).join("\n");
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `smartgrid_telemetry_logs_${Date.now()}.log`;
                a.click();
              }}
              className="p-1.5 rounded-lg border border-purple-900/40 bg-purple-950/15 text-purple-400 hover:text-purple-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={12} />
              Export
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-purple-950/40 text-purple-400 hover:text-purple-200 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Toolbar Filter / Search */}
        <div className="p-4 border-b border-purple-950/40 bg-[#0c0a18]/60 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-purple-950/60 bg-[#0f0d1a]/60">
            <Search size={14} className="text-purple-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by message or source module..."
              className="w-full bg-transparent border-0 outline-none text-xs text-purple-100 placeholder-purple-600/80"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {["ALL", "INFO", "WARN", "ERROR", "SUCCESS"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer",
                  levelFilter === lvl
                    ? "bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.15)]"
                    : "bg-[#0f0d1a] border-purple-950/50 text-purple-500 hover:border-purple-800/40"
                )}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Terminal Screen Console */}
        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs space-y-2 bg-[#05040a] relative scrollbar-thin">
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />

          {filteredLogs.length > 0 ? (
            filteredLogs.map((log, index) => (
              <div key={index} className="flex items-start gap-3 hover:bg-purple-950/5 p-1 rounded transition-colors">
                <span className="text-purple-600 font-bold shrink-0">{log.timestamp}</span>

                <span className={clsx(
                  "font-bold shrink-0 px-1.5 py-0.5 rounded text-[9px] leading-none border",
                  log.level === "INFO" && "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
                  log.level === "WARN" && "bg-amber-500/10 border-amber-500/20 text-amber-400",
                  log.level === "ERROR" && "bg-rose-500/10 border-rose-500/20 text-rose-400",
                  log.level === "SUCCESS" && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                )}>
                  {log.level}
                </span>

                <span className="text-purple-400 font-bold shrink-0">[{log.source}]</span>

                <span className="text-purple-200 leading-relaxed break-words">{log.message}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-purple-600 font-bold font-mono">NO CONSOLE LOGS MATCH FILTERS</p>
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>

        {/* Log Status Footer */}
        <div className="px-5 py-3 border-t border-purple-950/60 bg-[#0f0d1a]/80 flex items-center justify-between text-[10px] font-bold text-purple-500">
          <span>Active Buffer: {filteredLogs.length} entries</span>
          <span>Security Integrity Matrix Level 4</span>
        </div>
      </div>
    </div>
  );
}
