export const iceServers: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const baseURL = import.meta.env.VITE_BASE_URL ?? "localhost:5000";
export const secure = !baseURL.startsWith("localhost");
export const httpScheme = secure ? "https://" : "http://";
export const wsScheme = secure ? "wss://" : "ws://";
