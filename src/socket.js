import { io } from "socket.io-client";

export const socket = io(window.location.origin, {
  path: "/socket.io/",          // must match nginx + python socketio path
  transports: ["websocket"],
  auth: {
    token: localStorage.getItem("token"),
  },
  autoConnect: true,
});