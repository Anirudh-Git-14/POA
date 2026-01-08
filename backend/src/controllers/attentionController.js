import { randomUUID } from "crypto";
import { attentionSessions } from "../models/attentionSession.js";
import { validateAttentionDuration, detectBotBehavior } from "../utils/botDetection.js";
import { ipfsService } from "../services/ipfsService.js";
import { blockchainService } from "../services/blockchainService.js";

/**
 * Start a new attention tracking session
 */
export async function startAttentionSession(req, res, next) {
  try {
    const { userAddress, taskId } = req.body;
    const sessionId = randomUUID();
    const startedAt = Date.now();

    // Create session
    attentionSessions.set(sessionId, {
      sessionId,
      userAddress: userAddress.toLowerCase(),
      taskId,
      startedAt,
      heartbeats: [],
      ended: false,
    });

    console.log(`📝 Session started: ${sessionId} for user ${userAddress}, task ${taskId}`);

    res.json({
      success: true,
      sessionId,
      startedAt,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Receive heartbeat from frontend
 * Frontend should send this every 30 seconds while user is active
 */
export async function sendHeartbeat(req, res, next) {
  try {
    const { sessionId, userAddress, timestamp } = req.body;

    if (!sessionId || !userAddress) {
      return res.status(400).json({
        success: false,
        error: "sessionId and userAddress are required",
      });
    }

    const session = attentionSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    if (session.ended) {
      return res.status(400).json({
        success: false,
        error: "Session already ended",
      });
    }

    // Validate user address matches session
    if (session.userAddress !== userAddress.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: "User address does not match session",
      });
    }

    // Record heartbeat
    const heartbeatTime = timestamp || Date.now();
    session.heartbeats.push({
      timestamp: heartbeatTime,
      receivedAt: Date.now(),
    });

    console.log(`💓 Heartbeat received for session ${sessionId} (${session.heartbeats.length} total)`);

    res.json({
      success: true,
      received: true,
      timestamp: heartbeatTime,
      heartbeatCount: session.heartbeats.length,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * End attention session and mint POA if valid
 */
export async function endAttentionSession(req, res, next) {
  try {
    const { sessionId, userAddress } = req.body;

    if (!sessionId || !userAddress) {
      return res.status(400).json({
        success: false,
        error: "sessionId and userAddress are required",
      });
    }

    const session = attentionSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found",
      });
    }

    if (session.ended) {
      return res.status(400).json({
        success: false,
        error: "Session already ended",
      });
    }

    // Validate user address
    if (session.userAddress !== userAddress.toLowerCase()) {
      return res.status(403).json({
        success: false,
        error: "User address does not match session",
      });
    }

    const endedAt = Date.now();
    const duration = endedAt - session.startedAt;

    // Validate minimum duration
    // For development/testing we default to 10 seconds so it's easy to verify the flow.
    // In production, override MIN_ATTENTION_TIME in the environment (e.g. 300000 for 5 minutes).
    const minDuration = parseInt(process.env.MIN_ATTENTION_TIME || "10000"); // 10 seconds default
    if (duration < minDuration) {
      return res.status(400).json({
        success: false,
        error: `Attention duration too short. Minimum: ${minDuration}ms, Actual: ${duration}ms`,
        duration,
        minDuration,
      });
    }

    // Bot detection
    const botScore = detectBotBehavior(session);
    if (botScore > 0.7) {
      return res.status(400).json({
        success: false,
        error: "Attention pattern detected as bot-like",
        botScore,
      });
    }

    // Mark session as ended
    session.ended = true;
    session.endedAt = endedAt;
    session.duration = duration;

    // Create proof metadata
    const proofMetadata = {
      userAddress: session.userAddress,
      taskId: session.taskId,
      startedAt: session.startedAt,
      endedAt: endedAt,
      duration: duration,
      heartbeatCount: session.heartbeats.length,
      heartbeats: session.heartbeats,
      botScore: botScore,
    };

    // Upload to IPFS (mock-friendly)
    let ipfsHash;
    try {
      console.log(`📤 Uploading proof to IPFS for session ${sessionId}...`);
      ipfsHash = await ipfsService.uploadProof(proofMetadata);
    } catch (err) {
      console.warn(
        "⚠️  IPFS upload failed or not configured. Using fake IPFS hash for testing:",
        err.message
      );
      ipfsHash = "FAKE_IPFS_HASH_FOR_TESTING";
    }

    // Mint POA on blockchain (mock-friendly)
    let mintResult;
    const hasPrivateKey = !!process.env.PRIVATE_KEY;
    const hasContractAddress = !!process.env.CONTRACT_ADDRESS;

    if (hasPrivateKey && hasContractAddress) {
      console.log(`🔗 Minting POA on blockchain for user ${session.userAddress}...`);
      mintResult = await blockchainService.mintPOA(
        session.userAddress,
        session.taskId,
        ipfsHash
      );
      console.log(
        `✅ POA minted! Token ID: ${mintResult.tokenId}, TX: ${mintResult.transactionHash}`
      );
    } else {
      console.warn(
        "⚠️  Blockchain env vars missing (PRIVATE_KEY / CONTRACT_ADDRESS). Returning mocked mint result for testing."
      );
      mintResult = {
        tokenId: "FAKE_TOKEN_ID",
        transactionHash: "FAKE_TX_HASH_FOR_TESTING",
        blockNumber: 0,
      };
    }

    res.json({
      success: true,
      sessionId,
      tokenId: mintResult.tokenId,
      ipfsHash,
      transactionHash: mintResult.transactionHash,
      duration,
      heartbeatCount: session.heartbeats.length,
    });
  } catch (error) {
    next(error);
  }
}
