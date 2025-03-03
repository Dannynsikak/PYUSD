import RealTimeData from "./component/RealtimeData";
import BalanceChecker from "./component/balance";
import SupplyChart from "./component/supplyChart";
import Dashboard from "./component/market_dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold text-center text-white p-4">
        PYUSD Real-Time Dashboard
      </h2>
      <div className="flex gap-5 p-4">
        <RealTimeData />
        <SupplyChart />
      </div>
      <div className="">
        <BalanceChecker />
        <Dashboard />
      </div>
    </div>
  );
}
