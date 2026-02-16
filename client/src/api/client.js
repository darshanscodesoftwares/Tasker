import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 60000,
});

/**
 * Fetch AI summary for a given conversation URL.
 */
export async function summarizeUrl(url) {
  const { data } = await api.post("/summarize", { url });
  return data;
}

/**
 * Save a summary to the database.
 */
export async function saveSummary(payload) {
  const { data } = await api.post("/summaries", payload);
  return data;
}

/**
 * Retrieve all saved summaries.
 */
export async function getSummaries() {
  const { data } = await api.get("/summaries");
  return data;
}
