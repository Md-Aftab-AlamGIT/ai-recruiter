const mongoose = require("mongoose");

const shortlistSchema = new mongoose.Schema({
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

shortlistSchema.index({ recruiter: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model("Shortlist", shortlistSchema);
