import { io } from "socket.io-client";

const SOCKET_URL = "https://bql-production.up.railway.app";

export const adminSocket = io(SOCKET_URL, {
  transports: ["polling", "websocket"],
  autoConnect: false,
  auth: {
    token: localStorage.getItem("adminToken"),
    role: "admin",
  },
});
