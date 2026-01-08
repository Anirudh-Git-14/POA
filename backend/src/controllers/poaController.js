import { blockchainService } from "../services/blockchainService.js";

/**
 * Get POA data by token ID
 */
export async function getPOA(req, res, next) {
  try {
    const { tokenId } = req.params;

    if (!tokenId || isNaN(tokenId)) {
      return res.status(400).json({
        success: false,
        error: "Valid tokenId is required",
      });
    }

    const poaData = await blockchainService.getPOA(parseInt(tokenId));

    res.json({
      success: true,
      data: poaData,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all POAs for a user
 * 
 * Note: This is a simplified implementation. In production, you'd want to:
 * - Index POA mint events in a database
 * - Use a subgraph (The Graph)
 * - Cache results
 */
export async function getUserPOAs(req, res, next) {
  try {
    const { userAddress } = req.params;

    if (!userAddress) {
      return res.status(400).json({
        success: false,
        error: "userAddress is required",
      });
    }

    // For hackathon: return message that this needs indexing
    // In production, you'd query events or use a subgraph
    res.json({
      success: true,
      message: "User POA querying requires event indexing. Use getPOA with specific tokenId.",
      userAddress,
      note: "To implement: Index POAMinted events or use The Graph subgraph",
    });
  } catch (error) {
    next(error);
  }
}
