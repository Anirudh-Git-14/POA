import React from "react";
import { useAttention } from "../hooks/useAttention.js";
export default function AttentionTask({ taskId, attention, userAddress }) {
  const {
    isActive,
    sessionId,
    duration,
    heartbeatCount,
    error,
    startSession,
    endSession,
  } = attention;

  const handleStart = () => {
    if (!taskId.trim()) {
      alert("Please enter a task ID");
      return;
    }
    startSession(taskId);
  };

  const handleEnd = () => {
    if (window.confirm("Are you sure you want to end this attention session?")) {
      endSession();
    }
  };

  return (
    <div>
      {!isActive ? (
        <div>
          <button onClick={handleStart} className="success">
            Start Attention Task
          </button>
          <p style={{ marginTop: "10px", color: "#666" }}>
            Click to start tracking your attention. You'll need to maintain focus
            for at least 5 minutes.
          </p>
        </div>
      ) : (
        <div>
          <div className="status info">
            <strong>Session Active</strong>
            <br />
            Session ID: <span className="address">{sessionId}</span>
          </div>

          <div className="timer">Duration: {duration}</div>

          <div className="status">
            Heartbeats sent: <strong>{heartbeatCount}</strong>
            <br />
            <small>
              Heartbeats are sent automatically every 30 seconds to prove active
              attention.
            </small>
          </div>

          <button onClick={handleEnd} className="danger">
            End Task & Mint POA
          </button>

          <p style={{ marginTop: "10px", color: "#666" }}>
            Click to end the session. If you've maintained attention for at
            least 5 minutes, a POA token will be minted on the blockchain.
          </p>
        </div>
      )}

      {error && <div className="status error">{error}</div>}
    </div>
  );
}
