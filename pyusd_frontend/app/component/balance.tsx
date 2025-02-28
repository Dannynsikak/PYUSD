"use client";
import { useState } from "react";
import { fetchBalance } from "../../webSocketHook";

export default function BalanceChecker() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<string | null>(null);

  const checkBalance = async () => {
    const data = await fetchBalance(address);
    setBalance(data.wallet_balance);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-2xl font-bold mb-5">🏦 Check Wallet Balance</h1>
      <input
        type="text"
        className="p-2 text-black"
        placeholder="Enter Wallet Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button
        type="button"
        className="bg-blue-500 p-2 ml-2"
        onClick={checkBalance}
      >
        Check
      </button>
      {balance && <p className="mt-4">Balance: {balance}</p>}
    </div>
  );
}
