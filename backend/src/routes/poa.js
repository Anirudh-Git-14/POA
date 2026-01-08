import express from "express";
import { getPOA, getUserPOAs } from "../controllers/poaController.js";

const router = express.Router();

/**
 * GET /api/poa/:tokenId
 * Get POA data by token ID
 * 
 * Params: tokenId (number)
 * 
 * Returns: POA data from blockchain
 */
router.get("/:tokenId", getPOA);

/**
 * GET /api/poa/user/:userAddress
 * Get all POAs for a user (requires querying blockchain)
 * 
 * Params: userAddress (string)
 * 
 * Returns: Array of POA data
 * 
 * Note: This is a simplified version. In production, you might want to
 * index events or use a subgraph for efficient querying.
 */
router.get("/user/:userAddress", getUserPOAs);

export default router;
