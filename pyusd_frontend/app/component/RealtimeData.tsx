"use client";
import { useState, useEffect } from "react";
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

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (txData && txData.length > 0) {
      setTransactions([...txData]); // Ensure state updates
      setLastUpdated(new Date());
    }
  }, [txData]);

  const timeSinceLastUpdate = () => {
    const seconds = Math.floor(
      (currentTime.getTime() - lastUpdated.getTime()) / 1000
    );
    return `${seconds} seconds ago`;
  };

  return (
    <div className="p-6 max-w-4xl bg-[#0D0D1D] text-white rounded-lg shadow-lg h-[50%]">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[#13132A] p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-300"> PYUSD Supply</h3>
          <p className="text-xl font-bold text-blue-400">
            {supplyData?.total_supply}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Updated {timeSinceLastUpdate()}
          </p>
        </div>

        <div className="bg-[#13132A] p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-300">Gas Price</h3>
          <p className="text-xl font-bold text-yellow-400">
            {gasData?.gas_price_gwei} Gwei
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Updated {timeSinceLastUpdate()}
          </p>
        </div>
      </div>

      <div className="bg-[#13132A] mt-6 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-300 border-b pb-2">
          Latest Transactions
        </h3>
        <ul className="mt-3 max-h-80 overflow-auto divide-y divide-gray-700">
          {transactions.map((tx) => {
            const formattedTx = {
              from_address: tx.from,
              to_address: tx.to,
              amount: (
                Number.parseInt(tx.value) /
                10 ** Number.parseInt(tx.tokenDecimal)
              ).toFixed(2),
              gas_price: (Number.parseInt(tx.gasPrice) / 1e9).toFixed(2), // Convert Wei to Gwei
              gas_used: tx.gasUsed,
              block_number: tx.blockNumber,
              transaction_hash: tx.hash,
              confirmations: tx.confirmations,
              cummulativeGasUsed: tx.cumulativeGasUsed,
              contractAdress: tx.contractAddress,
              gas: tx.gas,
              input: tx.input,
              nonce: tx.nonce,
              contractAddress: tx.contractAddress,
              tokenSymbol: tx.tokenSymbol,
            };
            console.log("Updated Transactions:", transactions);

            return (
              <li
                key={tx.hash}
                className="py-4 text-sm hover:bg-gray-700 px-4 transition-all rounded-lg"
              >
                <div className="text-gray-300">
                  <span className="font-medium">Block:</span>{" "}
                  {formattedTx.block_number}
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">From:</span>{" "}
                  {formattedTx.from_address}
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">To:</span>{" "}
                  {formattedTx.to_address}
                </div>
                <div className="text-green-400 font-semibold">
                  ${formattedTx.amount}{" "}
                  <span className="text-blue-600">{tx.tokenSymbol}</span>
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">Gas Price:</span>{" "}
                  {formattedTx.gas_price} Gwei
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">Gas Used:</span>{" "}
                  {formattedTx.gas_used}
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">Transaction Hash:</span>{" "}
                  <span className="truncate w-full inline-block">
                    {formattedTx.transaction_hash}
                  </span>
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">Confirmations:</span>{" "}
                  {formattedTx.confirmations}
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">Cumulative Gas Used:</span>{" "}
                  {formattedTx.cummulativeGasUsed}
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">Gas:</span> {formattedTx.gas}{" "}
                  Gwei
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">Input:</span>{" "}
                  {formattedTx.input}{" "}
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">Nonce:</span>{" "}
                  {formattedTx.nonce}
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">Contract Address:</span>{" "}
                  {formattedTx.contractAddress}
                </div>
                <div className="text-gray-300">
                  <span className="font-medium">Token Symbol:</span>{" "}
                  <span className="text-blue-600">
                    {formattedTx.tokenSymbol}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default RealTimeData;
