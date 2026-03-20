const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  headline: String,
  summary: String,
  skills: [String],
  experience: [
    {
      title: String,
      company: String,
      startDate: String,
      endDate: String,
      description: String,
    },
  ],
  projects: [
    {
      name: String,
      description: String,
      link: String,
      technologies: [String],
    },
  ],
  education: [
    {
      degree: String,
      institution: String,
      year: String,
    },
  ],

  // New contact fields
  phone: String,
  location: String,
  linkedin: String,
  github: String,
  
  progress: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true },
});

module.exports = mongoose.model("Profile", profileSchema);
