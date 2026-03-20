const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Shortlist = require("../models/Shortlist");
const User = require("../models/User");

// @route    POST api/recruiter/shortlist/:candidateId
router.post("/shortlist/:candidateId", auth, async (req, res) => {
  try {
    const recruiter = await User.findById(req.user.id);
    if (recruiter.role !== "recruiter") {
      return res.status(403).json({ msg: "Only recruiters can shortlist" });
    }
    const candidate = await User.findById(req.params.candidateId);
    if (!candidate || candidate.role !== "candidate") {
      return res.status(404).json({ msg: "Candidate not found" });
    }

    const shortlist = new Shortlist({
      recruiter: req.user.id,
      candidate: req.params.candidateId,
    });
    await shortlist.save();
    res.json(shortlist);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Already shortlisted" });
    }
    res.status(500).send("Server error");
  }
});

// @route    GET api/recruiter/shortlist
router.get("/shortlist", auth, async (req, res) => {
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
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
