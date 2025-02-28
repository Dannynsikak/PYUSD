"use client";
import useWebSocket from "../../webSocketHook";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SupplyChart = () => {
  const supplyData = useWebSocket("ws://localhost:8000/ws/supply");
  const [marketData, setMarketData] = useState<
    { timestamp: number; supply: number }[]
  >([]);

  useEffect(() => {
    console.log("✅ Received supplyData:", supplyData);

    if (supplyData?.total_supply) {
      const supplyValue = Number(supplyData.total_supply);

      if (!Number.isNaN(supplyValue)) {
        setMarketData((prev) => {
          // Ensure we have at least one previous data point
          if (prev.length > 0) {
            const lastSupply = prev[prev.length - 1].supply;

            // Only update the graph if supply increases or decreases
            if (supplyValue !== lastSupply) {
              const newMarketData = [
                ...prev.slice(-20),
                {
                  timestamp: Date.now(),
                  supply: supplyValue,
                },
              ];
              console.log("🔄 Updated marketData:", newMarketData);
              return newMarketData;
            }
          } else {
            // First data point
            return [
              {
                timestamp: Date.now(),
                supply: supplyValue,
              },
            ];
          }
          return prev;
        });
      }
    }
  }, [supplyData]);

  const lowestSupply =
    marketData.length > 0 ? Math.min(...marketData.map((d) => d.supply)) : 0;
  const highestSupply =
    marketData.length > 0 ? Math.max(...marketData.map((d) => d.supply)) : 100;

  return (
    <div className="p-6 w-[80%] bg-[#0D0D1D] text-white rounded-lg shadow-lg h-[50%]">
      <h3 className="text-lg font-semibold text-gray-300 border-b pb-2">
        PYUSD Supply Movement
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={marketData}>
          <defs>
            <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(time) => new Date(time).toLocaleTimeString()}
            stroke="#ccc"
          />
          <YAxis
            domain={[lowestSupply, highestSupply]}
            tickFormatter={(value) => value.toLocaleString()}
            stroke="#ccc"
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#333", borderColor: "#333" }}
            labelStyle={{ color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="supply"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorSupply)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SupplyChart;
