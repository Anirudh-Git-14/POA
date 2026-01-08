/**
 * Validation Middleware
 * Validates request data before processing
 */

/**
 * Validate attention request (start session)
 */
export function validateAttentionRequest(req, res, next) {
  const { userAddress, taskId } = req.body;

  // Check required fields
  if (!userAddress || !taskId) {
    return res.status(400).json({
      success: false,
      error: "userAddress and taskId are required",
    });
  }

  // Validate Ethereum address format
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (!ethAddressRegex.test(userAddress)) {
    return res.status(400).json({
      success: false,
      error: "Invalid Ethereum address format",
    });
  }

  // Validate task ID (not empty)
  if (typeof taskId !== "string" || taskId.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "taskId must be a non-empty string",
    });
  }

  // Normalize user address (lowercase)
  req.body.userAddress = userAddress.toLowerCase();

  next();
}
