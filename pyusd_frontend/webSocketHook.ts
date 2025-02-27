"use client";

import { useState, useEffect } from "react";

const useWebSocket = (url: string) => {
  const [data, setData] = useState<any>(null);

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
