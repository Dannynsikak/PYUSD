"use client";

import useWebSocket from "../../webSocketHook";
import { Chart as ChartJS } from "chart.js/auto";
import { TimeScale, LinearScale, Tooltip, Chart } from "chart.js";
import { CandlestickController } from "chartjs-chart-financial";
import { CandlestickElement } from "chartjs-chart-financial";
import { Chart as ReactChart } from "react-chartjs-2";
import "chartjs-chart-financial";
import "chartjs-adapter-date-fns";

const API_WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

// Register the necessary components
ChartJS.register(
  CandlestickController,
  CandlestickElement,
  TimeScale,
  LinearScale,
  Tooltip
);

const Dashboard = () => {
  const marketData = useWebSocket(`${API_WS_URL}/ws/market-data`);
  const transactions = useWebSocket(`${API_WS_URL}/ws/market-transactions`);

  const priceHistory = marketData?.priceHistory || [];

  // Transform priceHistory into candlestick format
  const candleData = priceHistory.map((entry: any) => ({
    t: entry.timestamp, // Assuming each entry has a timestamp field
    o: entry.open,
    h: entry.high,
    l: entry.low,
    c: entry.close,
  }));

  const chartData = {
    labels: candleData.map((d) => new Date(d.t)),
    datasets: [
      {
        label: "PYUSD Candlestick",
        data: candleData,
        borderColor: "#36A2EB",
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">PYUSD Market Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Market Stats */}
        <div className="p-4 bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Market Stats</h2>
          <p>Price: ${marketData?.price || "Loading..."}</p>
          <p>Market Cap: ${marketData?.market_cap || "Loading..."}</p>
          <p>Liquidity: ${marketData?.liquidity || "Loading..."}</p>
          <p>FDV: ${marketData?.fdv || "Loading..."}</p>
        </div>

        {/* Candlestick Chart */}
        <div className="p-4 bg-gray-800 rounded-lg shadow-md col-span-2">
          <h2 className="text-lg font-semibold">Candlestick Chart</h2>
          <ReactChart
            type="candlestick"
            data={chartData}
            options={{
              responsive: true,
              scales: {
                x: {
                  type: "time",
                  time: { unit: "minute" },
                  position: "bottom",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <table className="w-full text-left mt-2">
          <thead>
            <tr>
              <th className="p-2">Type</th>
              <th className="p-2">Buys</th>
              <th className="p-2">Sells</th>
              <th className="p-2">Buyers</th>
              <th className="p-2">Sellers</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">24h</td>
              <td className="p-2">{transactions?.buys || "-"}</td>
              <td className="p-2">{transactions?.sells || "-"}</td>
              <td className="p-2">{transactions?.buyers || "-"}</td>
              <td className="p-2">{transactions?.sellers || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
