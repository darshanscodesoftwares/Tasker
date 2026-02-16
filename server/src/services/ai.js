import axios from "axios";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load the system prompt from prompts/summarize.txt
const SYSTEM_PROMPT = readFileSync(
  resolve(__dirname, "../../../prompts/summarize.txt"),
  "utf-8"
);

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const MODEL = "@cf/meta/llama-3.1-8b-instruct";

/**
 * Send conversation text to Cloudflare Workers AI and receive a structured summary.
 */
export async function generateSummary(conversationText) {
  if (!CF_ACCOUNT_ID || !CF_API_TOKEN) {
    throw new Error(
      "Cloudflare credentials not configured. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN."
    );
  }

  const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/${MODEL}`;

  const { data } = await axios.post(
    url,
    {
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: conversationText.slice(0, 6000) },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    }
  );

  if (!data.success) {
    throw new Error(data.errors?.[0]?.message || "Cloudflare AI request failed");
  }

  return data.result.response;
}
