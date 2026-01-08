import React, { useState, useEffect } from "react";
import * as api from "../services/api.js";

export default function POADisplay({ poaResult }) {
  const [poaData, setPoaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (poaResult?.tokenId && poaResult.tokenId !== "FAKE_TOKEN_ID") {
      fetchPOAData(poaResult.tokenId);
    }
  }, [poaResult?.tokenId]);

  const fetchPOAData = async (tokenId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getPOA(tokenId);
      setPoaData(result.data);
    } catch (err) {
      console.error("Error fetching POA data:", err);
      setError(err.response?.data?.error || err.message || "Failed to fetch POA data");
    } finally {
      setLoading(false);
    }
  };

  if (!poaResult) return null;

  const ipfsGateway = process.env.REACT_APP_IPFS_GATEWAY || "https://ipfs.io/ipfs/";
  const ipfsUrl = poaResult.ipfsHash
    ? `${ipfsGateway}${poaResult.ipfsHash}`
    : null;

  const isFakeTx =
    poaResult.transactionHash &&
    !poaResult.transactionHash.toString().toLowerCase().startsWith("0x");

  const polygonScanUrl =
    poaResult.transactionHash && !isFakeTx
      ? `https://polygonscan.com/tx/${poaResult.transactionHash}`
      : null;

  return (
    <div>
      <h2>✅ POA Token Minted Successfully!</h2>
      <div className="status success" style={{ marginTop: "10px" }}>
        <strong>Success:</strong>{" "}
        {isFakeTx
          ? "Mock mint completed (no real transaction was sent)."
          : "On-chain mint completed."}
      </div>

      <div className="status success">
        <strong>Token ID:</strong> {poaResult.tokenId}
        <br />
        <strong>Duration:</strong> {Math.floor(poaResult.duration / 1000 / 60)} minutes
        <br />
        <strong>Heartbeats:</strong> {poaResult.heartbeatCount}
      </div>

      {poaData && (
        <div className="status info" style={{ marginTop: "10px" }}>
          <strong>On-Chain Data:</strong>
          <br />
          User: <span className="address">{poaData.userAddress}</span>
          <br />
          Task ID: {poaData.taskId}
          <br />
          Timestamp: {new Date(parseInt(poaData.timestamp) * 1000).toLocaleString()}
        </div>
      )}

      {ipfsUrl && (
        <div style={{ marginTop: "10px" }}>
          <strong>Proof Metadata (IPFS):</strong>
          <br />
          <a
            href={ipfsUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ wordBreak: "break-all" }}
          >
            {ipfsUrl}
          </a>
        </div>
      )}

      {polygonScanUrl && (
        <div style={{ marginTop: "10px" }}>
          <strong>Transaction:</strong>
          <br />
          <a
            href={polygonScanUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ wordBreak: "break-all" }}
          >
            View on PolygonScan
          </a>
        </div>
      )}

      {isFakeTx && (
        <div style={{ marginTop: "10px" }}>
          <strong>Fake Transaction Link:</strong>
          <br />
          <span className="address">{poaResult.transactionHash}</span>
        </div>
      )}

      {loading && <div className="status">Loading POA data...</div>}
      {error && poaResult?.tokenId !== "FAKE_TOKEN_ID" && (
        <div className="status error">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}
