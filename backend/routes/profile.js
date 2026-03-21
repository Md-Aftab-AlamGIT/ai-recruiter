const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Profile = require("../models/Profile");
const User = require("../models/User");

// @route    GET api/profile/me
router.get("/me", auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "email"],
    );
    if (!profile) return res.json({});
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// @route    POST api/profile
router.post("/", auth, async (req, res, next) => {
  const {
    headline,
    summary,
    skills,
    experience,
    projects,
    education,
    progress,
  } = req.body;

  const profileFields = { user: req.user.id };
  if (headline) profileFields.headline = headline;
  if (summary) profileFields.summary = summary;
  if (skills) profileFields.skills = skills;
  if (experience) profileFields.experience = experience;
  if (projects) profileFields.projects = projects;
  if (education) profileFields.education = education;
  if (progress !== undefined) profileFields.progress = progress;

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true },
      );
      return res.json(profile);
    }
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

// @route    GET api/profile/all
router.get("/all", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== "recruiter") {
      return res.status(403).json({ msg: "Access denied" });
    }
    const profiles = await Profile.find().populate("user", ["name", "email"]);
    res.json(profiles);
  } catch (err) {
    next(err);
  }
});

// @route    GET api/profile/:userId
router.get("/:userId", auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      "user",
      ["name", "email"],
    );
    if (!profile) return res.status(404).json({ msg: "Profile not found" });
    res.json(profile);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
