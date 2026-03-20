const mongoose = require("mongoose");
const User = require("./models/User");
const Profile = require("./models/Profile");
require("dotenv").config();

const seedDemoUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Delete existing demo user if any
    await User.deleteOne({ email: "hire-me@anshumat.org" });
    await Profile.deleteOne({ user: null }); // cleanup orphan profiles

    const user = new User({
      email: "hire-me@anshumat.org",
      password: "HireMe@2025!",
      name: "Demo Candidate",
      role: "candidate",
    });
    await user.save();

    const profile = new Profile({
      user: user._id,
      headline: "Full Stack Developer",
      summary:
        "Experienced developer with 3 years in web development. Passionate about creating efficient and scalable applications.",
      skills: [
        "JavaScript",
        "React",
        "Node.js",
        "MongoDB",
        "Express",
        "Tailwind CSS",
      ],
      experience: [
        {
          title: "Software Developer",
          company: "Tech Corp",
          startDate: "2020",
          endDate: "2023",
          description:
            "Worked on full-stack applications using MERN stack. Improved performance by 40%.",
        },
      ],
      projects: [
        {
          name: "E-commerce App",
          description:
            "Built a MERN stack e-commerce platform with payment integration.",
          technologies: ["React", "Node", "MongoDB", "Stripe"],
        },
      ],
      education: [
        {
          degree: "B.Tech Computer Science",
          institution: "University of Technology",
          year: "2020",
        },
      ],
      progress: 80,
      isPublic: true,
    });
    await profile.save();

    console.log("✅ Demo user and profile created successfully");
    console.log("📧 Email: hire-me@anshumat.org");
    console.log("🔑 Password: HireMe@2025!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding demo user:", err);
  }
};

seedDemoUser();
