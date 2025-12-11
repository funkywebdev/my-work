import React, { useEffect } from "react";
import { io } from "socket.io-client";

const WebSocketTest = () => {
  useEffect(() => {
    // 1. Connect to WebSocket server
    const socket = io("ws://localhost:3000"); // replace with your backend URL

    // 2. Log when connected
    socket.on("connect", () => {
      console.log("✅ WebSocket connected!", socket.id);
    });

    // 3. Listen for ANY message from backend
    socket.onAny((event, data) => {
      console.log("📨 Event Received:", event, data);
    });

    // 4. Log when disconnected
    socket.on("disconnect", () => {
      console.log("❌ WebSocket disconnected");
    });

    return () => socket.disconnect();
  }, []);

  return <div>Check your console for WebSocket messages...</div>;
};

export default WebSocketTest;
