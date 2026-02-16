import { Router } from "express";
import Summary from "../models/Summary.js";

const router = Router();

/**
 * POST /api/summaries
 * Save a summary to MongoDB.
 */
router.post("/", async (req, res) => {
  try {
    const { sourceUrl, rawText, aiSummary, editedSummary } = req.body;

    if (!sourceUrl || !rawText || !aiSummary) {
      return res
        .status(400)
        .json({ error: "sourceUrl, rawText, and aiSummary are required." });
    }

    const summary = await Summary.create({
      sourceUrl,
      rawText,
      aiSummary,
      editedSummary: editedSummary || aiSummary,
    });

    return res.status(201).json(summary);
  } catch (err) {
    console.error("Save summary error:", err.message);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
});

/**
 * GET /api/summaries
 * Return all summaries sorted by most recent first.
 */
router.get("/", async (_req, res) => {
  try {
    const summaries = await Summary.find().sort({ createdAt: -1 }).lean();
    return res.json(summaries);
  } catch (err) {
    console.error("Fetch summaries error:", err.message);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
});

export default router;
