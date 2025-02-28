"use client";
import useWebSocket from "../../webSocketHook";

interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  from: string;
  contractAddress: string;
  to: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  transactionIndex: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  input: string;
  confirmations: string;
}

const RealTimeData = () => {
  const gasData = useWebSocket("ws://localhost:8000/ws/gas");
  const txData: Transaction[] = useWebSocket(
    "ws://localhost:8000/ws/transactions"
  );
  const supplyData = useWebSocket("ws://localhost:8000/ws/supply");

  return (
    <div className="p-6 max-w-4xl mx-auto bg-[#0D0D1D] text-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-white pb-4">
        PYUSD Real-Time Dashboard
      </h2>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#13132A] p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-300"> PYUSD Supply</h3>
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
        <ul className="mt-3 max-h-60 overflow-auto divide-y divide-gray-700">
          {txData?.slice(0, 5).map((tx) => {
            const formattedTx = {
              from_address: tx.from,
              to_address: tx.to,
              amount: (
                Number.parseInt(tx.value) /
                10 ** Number.parseInt(tx.tokenDecimal)
              ).toFixed(2),
            };

            return (
              <li
                key={tx.blockNumber}
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
