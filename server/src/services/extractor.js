import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Fetch a URL and extract visible text content from the page.
 * Strips scripts, styles, and collapses whitespace.
 */
export async function extractTextFromUrl(url) {
  const { data: html } = await axios.get(url, {
    timeout: 15000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; Tasker/1.0; +https://github.com/tasker)",
    },
  });

  const $ = cheerio.load(html);

  // Remove non-content elements
  $("script, style, noscript, nav, footer, header, svg, img").remove();

  // Extract text from common conversation containers, falling back to body
  const selectors = [
    "[data-message]",
    ".message",
    ".conversation",
    "article",
    "main",
    "body",
  ];

  let text = "";
  for (const sel of selectors) {
    const el = $(sel);
    if (el.length) {
      text = el.text();
      break;
    }
  }

  // Collapse whitespace
  return text.replace(/\s+/g, " ").trim();
}
