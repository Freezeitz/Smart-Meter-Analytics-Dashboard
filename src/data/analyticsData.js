// ─────────────────────────────────────────────────────────────
// KPI CARDS
// ─────────────────────────────────────────────────────────────

export const kpiData = [
  {
    id: 1,
    label: "Today's Usage",
    value: "12.4 kWh",
    change: "+8.2%",
    trend: "up",
    sparkline: [8, 9, 10, 11, 10, 12, 13, 12, 14, 13, 12, 12.4],
    color: "brand",
    icon: "Zap",
  },
  {
    id: 2,
    label: "Monthly Usage",
    value: "324 kWh",
    change: "+12.5%",
    trend: "up",
    sparkline: [210, 225, 240, 250, 265, 275, 280, 295, 305, 315, 320, 324],
    color: "accent",
    icon: "Gauge",
  },
  {
    id: 3,
    label: "Estimated Bill",
    value: "₹2,540",
    change: "+5.4%",
    trend: "up",
    sparkline: [1800, 1900, 2000, 2100, 2200, 2250, 2300, 2350, 2400, 2450, 2500, 2540],
    color: "emerald",
    icon: "IndianRupee",
  },
  {
    id: 4,
    label: "Peak Demand",
    value: "5.2 kW",
    change: "-0.4%",
    trend: "down",
    sparkline: [6.0, 5.9, 5.8, 5.7, 5.6, 5.5, 5.5, 5.4, 5.3, 5.3, 5.2, 5.2],
    color: "rose",
    icon: "Activity",
  },
];

// ─────────────────────────────────────────────────────────────
// MONTHLY CONSUMPTION TREND DATA
// ─────────────────────────────────────────────────────────────

export const revenueData = [
  { month: "Jan", consumption: 220, target: 200 },
  { month: "Feb", consumption: 240, target: 220 },
  { month: "Mar", consumption: 260, target: 240 },
  { month: "Apr", consumption: 250, target: 250 },
  { month: "May", consumption: 280, target: 260 },
  { month: "Jun", consumption: 300, target: 280 },
  { month: "Jul", consumption: 340, target: 300 },
  { month: "Aug", consumption: 380, target: 320 },
  { month: "Sep", consumption: 360, target: 340 },
  { month: "Oct", consumption: 330, target: 360 },
  { month: "Nov", consumption: 290, target: 380 },
  { month: "Dec", consumption: 260, target: 400 },
];

// ─────────────────────────────────────────────────────────────
// CONSUMPTION CATEGORIES (PIE CHART)
// ─────────────────────────────────────────────────────────────

export const trafficSources = [
  { name: "HVAC", value: 35, color: "#a855f7" }, // Neon purple
  { name: "Lighting", value: 20, color: "#06b6d4" }, // Neon Cyan
  { name: "Kitchen Appliances", value: 18, color: "#ec4899" }, // Pink/Fuchsia
  { name: "Electronics", value: 15, color: "#22c55e" }, // Green
  { name: "Others", value: 12, color: "#f59e0b" }, // Amber
];

// ─────────────────────────────────────────────────────────────
// ENERGY FLOW (FUNNEL CHART)
// ─────────────────────────────────────────────────────────────

export const funnelData = [
  { stage: "Generated", count: 50000, pct: 100 },
  { stage: "Transmitted", count: 48500, pct: 97 },
  { stage: "Distributed", count: 47000, pct: 94 },
  { stage: "Metered", count: 45500, pct: 91 },
  { stage: "Billed", count: 44000, pct: 88 },
];

// ─────────────────────────────────────────────────────────────
// METER ALERTS
// ─────────────────────────────────────────────────────────────

export const recentEvents = [
  {
    id: 1,
    type: "alert",
    message: "High consumption detected at Meter #1023",
    time: "5 min ago",
    icon: "AlertTriangle",
  },
  {
    id: 2,
    type: "usage",
    message: "Daily consumption exceeded threshold",
    time: "20 min ago",
    icon: "TrendingUp",
  },
  {
    id: 3,
    type: "alert",
    message: "Voltage fluctuation detected in Zone B",
    time: "1 hr ago",
    icon: "AlertTriangle",
  },
  {
    id: 4,
    type: "meter",
    message: "Smart Meter #2081 successfully registered",
    time: "3 hr ago",
    icon: "UserPlus",
  },
  {
    id: 5,
    type: "bill",
    message: "Estimated monthly bill recalculated",
    time: "5 hr ago",
    icon: "CreditCard",
  },
];