"use client";
import useWebSocket from "../../webSocketHook";

const RealTimeData = () => {
  const gasData = useWebSocket("ws://localhost:8000/ws/gas");
  const txData = useWebSocket("ws://localhost:8000/ws/transactions");
  const supplyData = useWebSocket("ws://localhost:8000/ws/supply");

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-900 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text pb-2 border-b border-gray-700">
        Real-Time PYUSD Data
      </h2>

      <div className="mt-4 bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">🔹 Gas Price:</p>
          <p className="font-semibold text-lg">
            {gasData?.gas_price_gwei} Gwei
          </p>
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-400">🔹 Total Supply:</p>
          <p className="font-semibold text-lg">{supplyData?.total_supply}</p>
        </div>

        <h3 className="mt-4 text-lg font-semibold border-b border-gray-700 pb-1">
          Latest Transactions
        </h3>

        <ul className="mt-3 max-h-48 overflow-auto divide-y divide-gray-700">
          {txData?.slice(0, 5).map((tx: any, index: number) => (
            <li
              key={index}
              className="py-2 text-sm hover:bg-gray-700 rounded-lg px-2 transition-all"
            >
              <span className="block text-gray-300">
                From: <span className="font-medium">{tx.from_address}</span>
              </span>
              <span className="block text-gray-300">
                To: <span className="font-medium">{tx.to_address}</span>
              </span>
              <span className="block text-green-400 font-semibold">
                ${tx.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RealTimeData;
