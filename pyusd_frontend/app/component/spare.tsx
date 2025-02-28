"use client";
import { useState, useEffect } from "react";
import useWebSocket from "../../webSocketHook";

const RealTimeData = () => {
  const gasData = useWebSocket("ws://localhost:8000/ws/gas");
  const supplyData = useWebSocket("ws://localhost:8000/ws/supply");
  const [txData, setTxData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/transactions");

    ws.onmessage = (event) => {
      const newTx = JSON.parse(event.data);
      setTxData((prevTxData) => {
        const updatedTxData = [newTx, ...prevTxData];
        return updatedTxData.slice(0, 20); // Keep only the latest 20 transactions
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-[#0D0D1D] text-white rounded-lg shadow-lg">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#13132A] p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-300">ETH Supply</h3>
          <p className="text-xl font-bold text-blue-400">
            {supplyData?.total_supply}
          </p>
          <p className="text-sm text-gray-400 mt-1">Updated just now</p>
        </div>

        <div className="bg-[#13132A] p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-300">Gas Price</h3>
          <p className="text-xl font-bold text-yellow-400">
            {gasData?.gas_price_gwei} Gwei
          </p>
          <p className="text-sm text-gray-400 mt-1">Updated just now</p>
        </div>
      </div>

      <div className="bg-[#13132A] mt-6 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-300 border-b pb-2">
          Latest Transactions
        </h3>
        <ul className="mt-3 max-h-100 overflow-auto divide-y divide-gray-700">
          {txData.map((tx, index) => {
            const formattedTx = {
              from_address: tx.from,
              to_address: tx.to,
              amount: (
                parseInt(tx.value) /
                10 ** parseInt(tx.tokenDecimal)
              ).toFixed(2),
            };

            return (
              <li
                key={index}
                className="py-2 text-sm hover:bg-gray-700 px-2 transition-all rounded-lg"
              >
                <span className="block text-gray-300">
                  From:{" "}
                  <span className="font-medium">
                    {formattedTx.from_address}
                  </span>
                </span>
                <span className="block text-gray-300">
                  To:{" "}
                  <span className="font-medium">{formattedTx.to_address}</span>
                </span>
                <span className="block text-green-400 font-semibold">
                  ${formattedTx.amount} {tx.tokenSymbol}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default RealTimeData;
