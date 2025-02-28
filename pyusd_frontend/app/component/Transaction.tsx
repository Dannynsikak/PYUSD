import type React from "react";

type TransactionProps = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  contractAddress: string;
  value: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  gasUsed: string;
  gasPrice: string;
};

const formatTime = (timestamp: string) => {
  return new Date(Number.parseInt(timestamp) * 1000).toLocaleString();
};

const formatValue = (value: string, decimal: string) => {
  return (Number.parseInt(value) / 10 ** Number.parseInt(decimal)).toFixed(2);
};

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

const TransactionCard: React.FC<{ tx: TransactionProps }> = ({ tx }) => {
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
    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg shadow-md border border-gray-800">
      <h2 className="text-lg font-semibold text-blue-400">
        Block #{tx.blockNumber}
      </h2>
      <p className="text-sm text-gray-400">{formatTime(tx.timeStamp)}</p>

      <div className="mt-3 space-y-2">
        <p className="text-gray-300">
          <span className="font-semibold">Hash:</span>{" "}
          <span className="text-blue-400">{shortenAddress(tx.hash)}</span>
        </p>
        <p className="text-gray-300">
          <span className="font-semibold">From:</span>{" "}
          <span className="text-red-400">{shortenAddress(tx.from)}</span>
        </p>
        <p className="text-gray-300">
          <span className="font-semibold">To:</span>{" "}
          <span className="text-green-400">{shortenAddress(tx.to)}</span>
        </p>
        <p className="text-gray-300">
          <span className="font-semibold">Contract:</span>{" "}
          <span className="text-yellow-400">
            {shortenAddress(tx.contractAddress)}
          </span>
        </p>
        <p className="text-gray-300">
          <span className="font-semibold">Value:</span>{" "}
          <span className="text-green-300">
            {formatValue(tx.value, tx.tokenDecimal)} {tx.tokenSymbol}
          </span>
        </p>
        <p className="text-gray-300">
          <span className="font-semibold">Gas Used:</span>{" "}
          {Number.parseInt(tx.gasUsed).toLocaleString()}
        </p>
        <p className="text-gray-300">
          <span className="font-semibold">Gas Price:</span>{" "}
          {(Number.parseInt(tx.gasPrice) / 10 ** 9).toFixed(2)} Gwei
        </p>
      </div>
    </div>
  );
};

const TransactionsList: React.FC<{ transactions: TransactionProps[] }> = ({
  transactions,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {transactions.map((tx) => (
        <TransactionCard key={tx.blockNumber} tx={tx} />
      ))}
    </div>
  );
};

export default TransactionsList;
