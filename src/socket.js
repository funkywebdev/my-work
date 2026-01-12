// import { io } from "socket.io-client";

// const SOCKET_URL = "https://bql-production.up.railway.app";

// export const socket = io(SOCKET_URL, {
//   transports: ["polling", "websocket"],
//   auth: {
//     token: localStorage.getItem("schoolToken"),
//   },
//   autoConnect: false,
// });


import { io } from "socket.io-client";

export const socket = io(
  "https://bql-production.up.railway.app/quiz",
  {
    autoConnect: false,
    auth: {
      token: localStorage.getItem("schoolToken"),
    },
  }
);
