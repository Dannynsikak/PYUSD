"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const useWebSocket = (url: string) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(url);

    socket.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    socket.onerror = (error) => {
      console.error("Websocket Error:", error);
    };

    return () => socket.close();
  }, [url]);

  return data;
};

export default useWebSocket;

export const fetchSupply = async () => {
  const response = await axios.get(`${API_URL}/pyusd/supply`);
  return response.data;
};

export const fetchGasPrice = async () => {
  const response = await axios.get(`${API_URL}/pyusd/gas`);
  return response.data;
};

export const fetchTransactions = async () => {
  const response = await axios.get(`${API_URL}/pyusd/transactions`);
  return response.data;
};

export const fetchBalance = async (walletAddress: string) => {
  const response = await axios.get(`${API_URL}/pyusd/balance/${walletAddress}`);
  return response.data;
};

export const fetchTransactionDetails = async (txHash: string) => {
  const response = await axios.get(`${API_URL}/pyusd/transaction/${txHash}`);
  return response.data;
};
