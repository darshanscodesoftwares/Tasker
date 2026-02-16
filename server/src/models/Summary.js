import mongoose from "mongoose";

const summarySchema = new mongoose.Schema({
  date: {
    type: String,
    default: () => new Date().toISOString().slice(0, 10),
  },
  sourceUrl: {
    type: String,
    required: true,
  },
  rawText: {
    type: String,
    required: true,
  },
  aiSummary: {
    type: String,
    required: true,
  },
  editedSummary: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Summary", summarySchema);
