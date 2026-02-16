import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import summarizeRouter from "./routes/summarize.js";
import summariesRouter from "./routes/summaries.js";

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/summarize", summarizeRouter);
app.use("/api/summaries", summariesRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Connect to MongoDB then start server
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/tasker";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`TASKER server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    // Start server anyway so the API can report errors gracefully
    app.listen(PORT, () => {
      console.log(
        `TASKER server running on http://localhost:${PORT} (no DB connection)`
      );
    });
  });
