"use client";
import { useState } from "react";
import { fetchBalance } from "../../webSocketHook";

export default function BalanceChecker() {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBalance = async () => {
    if (!address) {
      setError("Please enter a wallet address.");
      return;
    }

    setLoading(true);
    setError(null);
    setBalance(null);

    try {
      const data = await fetchBalance(address);
      setBalance(data.wallet_balance);
    } catch {
      setError("Failed to fetch balance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[20%] bg-[#13132A] text-white p-10 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-5">🏦 Check Wallet Balance</h1>
      <input
        type="text"
        className="p-2 text-white"
        placeholder="Enter Wallet Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button
        type="button"
        className="bg-blue-500 p-2 ml-2 rounded-lg"
        onClick={checkBalance}
        disabled={loading}
      >
        {loading ? "Checking your balance....." : "Check"}
      </button>
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {balance && (
        <p className="mt-4 text-green-600 font-bold">Balance: {balance}</p>
      )}
    </div>
  );
}
