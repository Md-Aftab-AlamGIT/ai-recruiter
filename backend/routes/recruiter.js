const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Shortlist = require("../models/Shortlist");
const User = require("../models/User");
const Profile = require("../models/Profile"); // To get candidate's name and job details
const { sendShortlistEmail } = require("../services/emailService"); // Email notification service

// @route    POST api/recruiter/shortlist/:candidateId
router.post("/shortlist/:candidateId", auth, async (req, res, next) => {
  try {
    const recruiter = await User.findById(req.user.id);
    if (recruiter.role !== "recruiter") {
      return res.status(403).json({ msg: "Only recruiters can shortlist" });
    }

    const candidate = await User.findById(req.params.candidateId);
    if (!candidate || candidate.role !== "candidate") {
      return res.status(404).json({ msg: "Candidate not found" });
    }

    // Prevent duplicate shortlisting
    const existing = await Shortlist.findOne({
      recruiter: req.user.id,
      candidate: req.params.candidateId,
    });
    if (existing) {
      return res.status(400).json({ msg: "Already shortlisted" });
    }

    const shortlist = new Shortlist({
      recruiter: req.user.id,
      candidate: req.params.candidateId,
    });
    await shortlist.save();

    // Fetch candidate's profile to get name and applied job (optional)
    const profile = await Profile.findOne({ user: candidate._id }).populate(
      "user",
      "name email",
    );
    const candidateName = profile?.user?.name || candidate.name || "Candidate";

    // Optional: If you want to include the job title, fetch it from the applied job
    let jobTitle = "the position";
    if (profile && profile.appliedJobId) {
      // Uncomment if you have a Job model and want to fetch job title
      // const Job = require("../models/Job");
      // const job = await Job.findById(profile.appliedJobId);
      // if (job) jobTitle = job.title;
    }

    // Send email notification (non-blocking, catch errors)
    sendShortlistEmail(candidate.email, candidateName, jobTitle).catch((err) =>
      console.error("Failed to send shortlist email:", err),
    );

    res.json(shortlist);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Already shortlisted" });
    }
    next(err);
  }
});

// @route    GET api/recruiter/shortlist
router.get("/shortlist", auth, async (req, res, next) => {
  try {
    const recruiter = await User.findById(req.user.id);
    if (recruiter.role !== "recruiter") {
      return res.status(403).json({ msg: "Access denied" });
    }
    const shortlisted = await Shortlist.find({
      recruiter: req.user.id,
    }).populate("candidate", ["name", "email"]);
    res.json(shortlisted);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
