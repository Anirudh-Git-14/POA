import express from "express";
import {
  startAttentionSession,
  sendHeartbeat,
  endAttentionSession,
} from "../controllers/attentionController.js";
import { validateAttentionRequest } from "../middleware/validation.js";

const router = express.Router();

/**
 * POST /api/attention/start
 * Start a new attention tracking session
 * 
 * Body: {
 *   userAddress: string (wallet address)
 *   taskId: string
 * }
 * 
 * Returns: { sessionId, startedAt }
 */
router.post("/start", validateAttentionRequest, startAttentionSession);

/**
 * POST /api/attention/heartbeat
 * Send periodic heartbeat to prove active attention
 * 
 * Body: {
 *   sessionId: string
 *   userAddress: string
 *   timestamp: number (optional, server will use current time)
 * }
 * 
 * Returns: { received: true, timestamp }
 */
router.post("/heartbeat", sendHeartbeat);

/**
 * POST /api/attention/end
 * End attention session and mint POA if valid
 * 
 * Body: {
 *   sessionId: string
 *   userAddress: string
 * }
 * 
 * Returns: { success: true, tokenId, ipfsHash, transactionHash }
 */
router.post("/end", endAttentionSession);

export default router;
