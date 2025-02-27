import RealTimeData from "./component/RealtimeData";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">PYUSD Dashboard</h1>
      <RealTimeData />
    </div>
  );
}
