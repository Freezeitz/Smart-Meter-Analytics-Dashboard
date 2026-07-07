import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { trafficSources } from "../data/analyticsData";
import { useTheme } from "../context/ThemeContext";
import clsx from "clsx";

const CustomTooltip = ({ active, payload, isDark }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];

  return (
    <div
      className={clsx(
        "px-3 py-2 rounded-xl text-sm shadow-xl border",
        isDark
          ? "bg-slate-800 border-slate-700 text-slate-100"
          : "bg-white border-slate-200 text-slate-800"
      )}
    >
      <span style={{ color: d.payload.color }} className="font-semibold">
        {d.name}
      </span>
      : {d.value}%
    </div>
  );
};

const RADIAN = Math.PI / 180;

const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, value }) => {
  const r = outerRadius + 18;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);

  if (value < 8) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#94a3b8"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
    >
      {value}%
    </text>
  );
};

export default function TrafficSources() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={clsx(
        "rounded-2xl p-5 border",
        isDark
          ? "bg-slate-800/60 border-slate-700/50"
          : "bg-white border-slate-200 shadow-sm"
      )}
    >
      {/* Header */}
      <div className="mb-4">
        <h2 className="font-bold text-base">
          Consumption Categories
        </h2>

        <p
          className={clsx(
            "text-xs mt-0.5",
            isDark ? "text-slate-500" : "text-slate-400"
          )}
        >
          Energy usage by category
        </p>
      </div>

      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={trafficSources}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
            >
              {trafficSources.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.color}
                  strokeWidth={0}
                />
              ))}
            </Pie>

            <Tooltip
              content={<CustomTooltip isDark={isDark} />}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="w-full mt-2 space-y-2">
          {trafficSources.map((src) => (
            <div
              key={src.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: src.color }}
                />

                <span
                  className={clsx(
                    "text-xs",
                    isDark
                      ? "text-slate-400"
                      : "text-slate-600"
                  )}
                >
                  {src.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={clsx(
                    "h-1 w-16 rounded-full overflow-hidden",
                    isDark
                      ? "bg-slate-700"
                      : "bg-slate-100"
                  )}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${src.value}%`,
                      background: src.color,
                    }}
                  />
                </div>

                <span
                  className={clsx(
                    "text-xs font-medium w-6 text-right",
                    isDark
                      ? "text-slate-300"
                      : "text-slate-700"
                  )}
                >
                  {src.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}