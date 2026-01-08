import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import attentionRoutes from "./routes/attention.js";
import poaRoutes from "./routes/poa.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow frontend to call API
app.use(express.json()); // Parse JSON request bodies

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "POA Backend API is running" });
});

// API Routes
app.use("/api/attention", attentionRoutes);
app.use("/api/poa", poaRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 POA Backend server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

export default app;
