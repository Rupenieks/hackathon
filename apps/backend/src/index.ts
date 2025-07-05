import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createCompanyRoutes } from "./routes/companyRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "AI Search Analytics Backend",
  });
});

// API routes
const brandfetchApiKey = process.env.BRANDFETCH_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

if (!brandfetchApiKey) {
  console.error("BRANDFETCH_API_KEY is required in environment variables");
  process.exit(1);
}

if (!openaiApiKey) {
  console.error("OPENAI_API_KEY is required in environment variables");
  process.exit(1);
}

app.use("/api", createCompanyRoutes(brandfetchApiKey, openaiApiKey));

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AI Search Analytics Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(
    `🔍 Company analysis: POST http://localhost:${PORT}/api/analyze-company`
  );
});
