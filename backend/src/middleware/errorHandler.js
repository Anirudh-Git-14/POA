/**
 * Error Handler Middleware
 * Centralized error handling for Express
 */

export function errorHandler(err, req, res, next) {
  console.error("❌ Error:", err);

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
