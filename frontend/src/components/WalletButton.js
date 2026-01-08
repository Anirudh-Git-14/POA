import React from "react";
import { useWallet } from "../contexts/WalletContext.js";

export default function WalletButton() {
  const { account, isConnecting, error, connectWallet, disconnectWallet, isMetaMaskInstalled } =
    useWallet();

  if (!isMetaMaskInstalled) {
    return (
      <div className="status error">
        MetaMask is not installed.{" "}
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#721c24" }}
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  if (account) {
    return (
      <div>
        <button onClick={disconnectWallet}>Disconnect Wallet</button>
        {error && <div className="status error">{error}</div>}
      </div>
    );
  }

  return (
    <div>
      <button onClick={connectWallet} disabled={isConnecting}>
        {isConnecting ? "Connecting..." : "Connect MetaMask"}
      </button>
      {error && <div className="status error">{error}</div>}
    </div>
  );
}
