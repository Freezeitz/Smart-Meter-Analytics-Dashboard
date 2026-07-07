import KPICards from "./KPICards";
import RevenueChart from "./RevenueChart";
import TrafficSources from "./TrafficSources";
import FunnelChart from "./FunnelChart";
import MeterAlerts from "./MeterAlerts";
import MonthlyConsumption from "./MonthlyConsumption";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">

      {/* KPI Cards */}
      <KPICards />

      {/* Main Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <RevenueChart />
        </div>

        <TrafficSources />
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FunnelChart />
        <MonthlyConsumption />
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 gap-5">
        <MeterAlerts />
      </div>

    </div>
  );
}