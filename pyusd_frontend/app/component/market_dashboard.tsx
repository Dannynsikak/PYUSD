"use client";

import { useState } from "react";
import useWebSocket from "../../webSocketHook";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const API_WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

const Dashboard = () => {
  const marketData = useWebSocket(`${API_WS_URL}/ws/market-data`);
  const transactions = useWebSocket(`${API_WS_URL}/ws/market-transactions`);

  const priceHistory = marketData?.price
    ? [...(marketData?.priceHistory || []), marketData.price]
    : [];

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

        {/* Price Chart */}
        <div className="p-4 bg-gray-800 rounded-lg shadow-md col-span-2">
          <h2 className="text-lg font-semibold">Price Chart</h2>
          <Line
            data={{
              labels: priceHistory.map((_, index) => index),
              datasets: [
                {
                  label: "PYUSD Price",
                  data: priceHistory,
                  borderColor: "#36A2EB",
                  backgroundColor: "rgba(54, 162, 235, 0.5)",
                },
              ],
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
