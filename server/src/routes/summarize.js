import { Router } from "express";
import { extractTextFromUrl } from "../services/extractor.js";
import { generateSummary } from "../services/ai.js";

const router = Router();

/**
 * POST /api/summarize
 * Body: { url: string }
 * Fetches conversation from URL, extracts text, calls AI, returns summary.
 */
router.post("/", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      return res.status(400).json({ error: "A valid URL is required." });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL format." });
    }

    // Step 1 — extract text from the conversation page
    const rawText = await extractTextFromUrl(url);

    if (!rawText || rawText.length < 40) {
      return res.status(422).json({
        error:
          "Could not extract conversation text from the URL. " +
          "If this is a ChatGPT share link, make sure the conversation is publicly shared.",
      });
    }

    // Step 2 — generate AI summary
    const aiSummary = await generateSummary(rawText);

    return res.json({
      sourceUrl: url,
      rawText: rawText.slice(0, 2000), // truncate for response
      aiSummary,
    });
  } catch (err) {
    console.error("Summarize error:", err.message);
    return res
      .status(500)
      .json({ error: err.message || "Internal server error" });
  }
});

export default router;
