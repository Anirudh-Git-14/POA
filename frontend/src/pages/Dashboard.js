import React, { useState } from "react";
import { useWallet } from "../contexts/WalletContext.js";
import { useAttention } from "../hooks/useAttention.js";
import WalletButton from "../components/WalletButton.js";
import AttentionTask from "../components/AttentionTask.js";
import POADisplay from "../components/POADisplay.js";

export default function Dashboard() {
  const { account, isMetaMaskInstalled } = useWallet();
  const [taskId, setTaskId] = useState("task-001");
  const attention = useAttention(account);

  return (
    <div className="container">
      <div className="header">
        <h1>Proof-of-Attention (POA) dApp</h1>
        <p>Track your attention and earn blockchain-verified POA tokens</p>
      </div>

      <div className="card">
        <h2>Wallet Connection</h2>
        {!isMetaMaskInstalled && (
          <div className="status error">
            MetaMask is not installed. Please install MetaMask to continue.
          </div>
        )}
        <WalletButton />
        {account && (
          <div className="status success" style={{ marginTop: "10px" }}>
            Connected: <span className="address">{account}</span>
          </div>
        )}
      </div>

      {account && (
        <>
          <div className="card">
            <h2>Attention Task</h2>
            <div style={{ marginBottom: "10px" }}>
              <label>
                Task ID:{" "}
                <input
                  type="text"
                  value={taskId}
                  onChange={(e) => setTaskId(e.target.value)}
                  disabled={attention.isActive}
                  style={{ padding: "5px", fontSize: "14px" }}
                />
              </label>
            </div>
            <AttentionTask
              taskId={taskId}
              attention={attention}
              userAddress={account}
            />
          </div>

          {attention.poaResult && (
            <div className="card">
              <POADisplay poaResult={attention.poaResult} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
