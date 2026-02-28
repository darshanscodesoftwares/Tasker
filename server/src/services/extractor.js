import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Detect whether a URL points to a ChatGPT share page.
 */
function isChatGptShareUrl(url) {
  try {
    const u = new URL(url);
    return (
      (u.hostname === "chatgpt.com" || u.hostname === "chat.openai.com") &&
      u.pathname.startsWith("/share/")
    );
  } catch {
    return false;
  }
}

/**
 * Extract conversation text from a ChatGPT share page.
 *
 * ChatGPT embeds conversation data in a <script id="__NEXT_DATA__"> JSON blob.
 * The structure is:
 *   props.pageProps.serverResponse.data.mapping
 * where each entry has message.author.role and message.content.parts[].
 */
function extractChatGptConversation(html) {
  const $ = cheerio.load(html);

  // Try __NEXT_DATA__ first (primary method)
  const nextData = $("#__NEXT_DATA__").html();
  if (nextData) {
    try {
      const json = JSON.parse(nextData);
      const mapping =
        json?.props?.pageProps?.serverResponse?.data?.mapping || {};

      // Collect messages and sort by create_time
      const messages = Object.values(mapping)
        .filter(
          (node) =>
            node.message &&
            node.message.content &&
            node.message.content.parts &&
            node.message.content.parts.length > 0 &&
            (node.message.author.role === "user" ||
              node.message.author.role === "assistant")
        )
        .sort(
          (a, b) =>
            (a.message.create_time || 0) - (b.message.create_time || 0)
        )
        .map((node) => {
          const role = node.message.author.role;
          const text = node.message.content.parts.join("\n").trim();
          return `[${role}]: ${text}`;
        });

      if (messages.length > 0) {
        return messages.join("\n\n");
      }
    } catch {
      // JSON parsing failed — fall through to DOM approach
    }
  }

  // Fallback: try extracting from rendered DOM elements
  // ChatGPT sometimes pre-renders some content
  $("script, style, noscript, nav, footer, header, svg, img").remove();
  const selectors = [
    "[data-message-author-role]",
    "[data-message-id]",
    ".markdown",
    "article",
    "main",
  ];

  for (const sel of selectors) {
    const els = $(sel);
    if (els.length) {
      const texts = [];
      els.each((_, el) => {
        const t = $(el).text().trim();
        if (t) texts.push(t);
      });
      if (texts.join(" ").length > 40) {
        return texts.join("\n\n");
      }
    }
  }

  return "";
}

/**
 * Generic extractor for non-ChatGPT pages.
 */
function extractGenericText(html) {
  const $ = cheerio.load(html);

  // Remove non-content elements
  $("script, style, noscript, nav, footer, header, svg, img").remove();

  // Try common conversation container selectors
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

  return text.replace(/\s+/g, " ").trim();
}

/**
 * Fetch a URL and extract conversation text.
 * Handles ChatGPT share links specially; falls back to generic extraction.
 */
export async function extractTextFromUrl(url) {
  const { data: html } = await axios.get(url, {
    timeout: 15000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  });

  if (isChatGptShareUrl(url)) {
    const text = extractChatGptConversation(html);
    if (text && text.length > 40) {
      return text;
    }
    // If ChatGPT-specific extraction failed, fall through to generic
  }

  return extractGenericText(html);
}
