import { useState, useEffect, useRef } from "react";
import * as api from "../services/api.js";

// For development/testing we use a short heartbeat interval (2 seconds)
// so you can quickly see the counter increase. In production, increase this
// to something like 30000 (30 seconds).
const HEARTBEAT_INTERVAL = 2000; // 2 seconds for testing

export function useAttention(userAddress) {
  const [sessionId, setSessionId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [startedAt, setStartedAt] = useState(null);
  const [duration, setDuration] = useState(0);
  const [heartbeatCount, setHeartbeatCount] = useState(0);
  const [error, setError] = useState(null);
  const [poaResult, setPoaResult] = useState(null);

  const heartbeatIntervalRef = useRef(null);
  const durationIntervalRef = useRef(null);

  // Format duration as MM:SS
  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Start attention session
  const startSession = async (taskId) => {
    if (!userAddress) {
      setError("Wallet not connected");
      return;
    }

    try {
      setError(null);
      const result = await api.startAttentionSession(userAddress, taskId);
      setSessionId(result.sessionId);
      setStartedAt(result.startedAt);
      setIsActive(true);
      setHeartbeatCount(0);
      setPoaResult(null);

      // Start sending heartbeats
      startHeartbeats(result.sessionId);

      // Start duration timer
      startDurationTimer(result.startedAt);

      console.log("Session started:", result.sessionId);
    } catch (err) {
      console.error("Error starting session:", err);
      setError(err.response?.data?.error || err.message || "Failed to start session");
    }
  };

  // Send periodic heartbeats
  const startHeartbeats = (sessionId) => {
    // Send first heartbeat immediately
    sendHeartbeat(sessionId);

    // Then send every 30 seconds
    heartbeatIntervalRef.current = setInterval(() => {
      sendHeartbeat(sessionId);
    }, HEARTBEAT_INTERVAL);
  };

  // Send a single heartbeat
  const sendHeartbeat = async (sessionId) => {
    if (!userAddress || !sessionId) return;

    try {
      const result = await api.sendHeartbeat(sessionId, userAddress, Date.now());
      setHeartbeatCount(result.heartbeatCount || 0);
      console.log("Heartbeat sent:", result.heartbeatCount);
    } catch (err) {
      console.error("Error sending heartbeat:", err);
      // Don't show error to user for heartbeat failures
    }
  };

  // Update duration display
  const startDurationTimer = (startTime) => {
    durationIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setDuration(elapsed);
    }, 1000); // Update every second
  };

  // End attention session
  const endSession = async () => {
    if (!sessionId || !userAddress) {
      setError("No active session");
      return;
    }

    try {
      setError(null);
      const result = await api.endAttentionSession(sessionId, userAddress);
      setPoaResult(result);
      setIsActive(false);

      // Clear intervals
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      console.log("Session ended, POA minted:", result);
    } catch (err) {
      console.error("Error ending session:", err);
      setError(err.response?.data?.error || err.message || "Failed to end session");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  return {
    sessionId,
    isActive,
    startedAt,
    duration: formatDuration(duration),
    durationMs: duration,
    heartbeatCount,
    error,
    poaResult,
    startSession,
    endSession,
  };
}
