import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Start a new attention session
 */
export async function startAttentionSession(userAddress, taskId) {
  const response = await api.post("/api/attention/start", {
    userAddress,
    taskId,
  });
  return response.data;
}

/**
 * Send heartbeat to backend
 */
export async function sendHeartbeat(sessionId, userAddress, timestamp) {
  const response = await api.post("/api/attention/heartbeat", {
    sessionId,
    userAddress,
    timestamp,
  });
  return response.data;
}

/**
 * End attention session and mint POA
 */
export async function endAttentionSession(sessionId, userAddress) {
  const response = await api.post("/api/attention/end", {
    sessionId,
    userAddress,
  });
  return response.data;
}

/**
 * Get POA data by token ID
 */
export async function getPOA(tokenId) {
  const response = await api.get(`/api/poa/${tokenId}`);
  return response.data;
}

/**
 * Health check
 */
export async function healthCheck() {
  const response = await api.get("/health");
  return response.data;
}

export default api;
