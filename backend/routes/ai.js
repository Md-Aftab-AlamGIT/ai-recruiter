const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

// Mock AI: Parse experience from text
router.post("/parse-experience", auth, async (req, res, next) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ msg: "Text required" });

  try {
    // Simple rule-based parsing (for demo)
    const lines = text.split("\n").filter((l) => l.trim());
    const experiences = lines
      .map((line) => {
        // Format: "Title at Company (start - end) Description"
        const match = line.match(
          /(.+)\s+at\s+(.+)\s+\((.+)\s*-\s*(.+)\)\s*(.*)/,
        );
        if (match) {
          return {
            title: match[1].trim(),
            company: match[2].trim(),
            startDate: match[3].trim(),
            endDate: match[4].trim(),
            description: match[5].trim(),
          };
        }
        return null;
      })
      .filter((e) => e);

    res.json(experiences);
  } catch (err) {
    next(err);
  }
});

// Mock AI: Suggest skills based on text
router.post("/suggest-skills", auth, async (req, res, next) => {
  const { text } = req.body;
  const commonSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "MongoDB",
    "SQL",
    "AWS",
    "Docker",
    "TypeScript",
    "Angular",
    "Vue",
    "PHP",
    "Ruby",
  ];
  try {
    const suggestions = commonSkills.filter((skill) =>
      skill.toLowerCase().includes(text.toLowerCase()),
    );
    res.json(suggestions);
  } catch (err) {
    next(err);
  }
});

// Mock AI: Generate summary
router.post("/generate-summary", auth, async (req, res, next) => {
  const { profile } = req.body;
  try {
    const summary = `${profile.headline || "Professional"} with experience in ${profile.skills?.slice(0, 3).join(", ") || "various technologies"}. Passionate about building impactful solutions and continuous learning.`;
    res.json({ summary });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
