import { io, Socket } from "socket.io-client";
import { getAuthToken } from "./api/client";

let socket: Socket | null = null;
let currentSocketToken: string | null = null;

export const getSocket = (): Socket | null => {
  if (typeof window === "undefined") return null;

  const token = getAuthToken();
  if (!token) {
    if (socket) {
      socket.disconnect();
      socket = null;
      currentSocketToken = null;
    }
    return null;
  }

  // If token changed, disconnect previous and reconnect with new token
  if (socket && currentSocketToken !== token) {
    socket.disconnect();
    socket = null;
    currentSocketToken = null;
  }

  if (!socket || !socket.connected) {
    currentSocketToken = token;
    const SOCKET_URL =
      process.env.NEXT_PUBLIC_SOCKET_URL ||
      process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") ||
      "http://localhost:5000";

    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 15,
      reconnectionDelay: 1500,
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("⚡ Socket.IO client connected:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.warn("⚠️ Socket.IO connection error:", err.message);
    });
  }

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentSocketToken = null;
  }
};
