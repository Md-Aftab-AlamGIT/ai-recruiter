import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useDebounce } from "../hooks/useDebounce";

const ProfileBuilder = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    headline: "",
    summary: "",
    skills: [],
    experience: [],
    projects: [],
    education: [],
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    progress: 0,
  });
  const [savedStatus, setSavedStatus] = useState("All changes saved");
  const [aiAssistText, setAiAssistText] = useState("");
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiField, setAiField] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        if (res.data && Object.keys(res.data).length > 0) {
          setProfile(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Auto-save with debounce
  const debouncedProfile = useDebounce(profile, 2000);
  useEffect(() => {
    const saveProfile = async () => {
      try {
        await api.post("/profile", profile);
        setSavedStatus("Profile saved");
      } catch (err) {
        setSavedStatus("Save failed");
        console.error(err);
      }
    };
    if (debouncedProfile && !loading) {
      saveProfile();
    }
  }, [debouncedProfile, loading]);

  // Progress calculation (including contact fields)
  const calculateProgress = useCallback(() => {
    let total = 0;
    let filled = 0;
    if (profile.headline && profile.headline.trim() !== "") filled++;
    total++;
    if (profile.summary && profile.summary.trim() !== "") filled++;
    total++;
    if (profile.skills && profile.skills.length > 0) filled++;
    total++;
    if (profile.experience && profile.experience.length > 0) filled++;
    total++;
    if (profile.projects && profile.projects.length > 0) filled++;
    total++;
    if (profile.education && profile.education.length > 0) filled++;
    total++;
    if (profile.phone && profile.phone.trim() !== "") filled++;
    total++;
    if (profile.location && profile.location.trim() !== "") filled++;
    total++;
    if (profile.linkedin && profile.linkedin.trim() !== "") filled++;
    total++;
    if (profile.github && profile.github.trim() !== "") filled++;
    total++;
    return Math.round((filled / total) * 100);
  }, [profile]);

  useEffect(() => {
    const progress = calculateProgress();
    setProfile((prev) => ({ ...prev, progress }));
  }, [
    profile.headline,
    profile.summary,
    profile.skills,
    profile.experience,
    profile.projects,
    profile.education,
    profile.phone,
    profile.location,
    profile.linkedin,
    profile.github,
    calculateProgress,
  ]);

  // Handlers
  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setSavedStatus("Saving...");
  };

  // Experience handlers (same as before)
  const addExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: "", company: "", startDate: "", endDate: "", description: "" },
      ],
    }));
  };
  const updateExperience = (index, field, value) => {
    const newExp = [...profile.experience];
    newExp[index][field] = value;
    setProfile((prev) => ({ ...prev, experience: newExp }));
  };
  const removeExperience = (index) => {
    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // Project handlers
  const addProject = () => {
    setProfile((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: "", description: "", technologies: [], link: "" },
      ],
    }));
  };
  const updateProject = (index, field, value) => {
    const newProjects = [...profile.projects];
    if (field === "technologies") {
      newProjects[index][field] = value.split(",").map((s) => s.trim());
    } else {
      newProjects[index][field] = value;
    }
    setProfile((prev) => ({ ...prev, projects: newProjects }));
  };
  const removeProject = (index) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  // Education handlers
  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", year: "" }],
    }));
  };
  const updateEducation = (index, field, value) => {
    const newEdu = [...profile.education];
    newEdu[index][field] = value;
    setProfile((prev) => ({ ...prev, education: newEdu }));
  };
  const removeEducation = (index) => {
    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Skills handlers
  const addSkill = (skill) => {
    if (skill && !profile.skills.includes(skill)) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };
  const removeSkill = (index) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // AI Assist functions (unchanged)
  const handleAIAssist = async () => {
    if (!aiAssistText.trim()) return;
    try {
      if (aiField === "experience") {
        const res = await api.post("/ai/parse-experience", {
          text: aiAssistText,
        });
        const parsed = res.data;
        if (parsed.length > 0) {
          setProfile((prev) => ({
            ...prev,
            experience: [...prev.experience, ...parsed],
          }));
        } else {
          alert("Could not parse experience. Please try a different format.");
        }
      } else if (aiField === "projects") {
        const newProject = {
          name: "Project from description",
          description: aiAssistText,
          technologies: [],
          link: "",
        };
        setProfile((prev) => ({
          ...prev,
          projects: [...prev.projects, newProject],
        }));
      }
      setShowAiModal(false);
      setAiAssistText("");
    } catch (err) {
      console.error(err);
      alert("AI parsing failed");
    }
  };

  const generateSummary = async () => {
    try {
      const res = await api.post("/ai/generate-summary", { profile });
      setProfile((prev) => ({ ...prev, summary: res.data.summary }));
    } catch (err) {
      console.error(err);
    }
  };

  const suggestSkills = async (input) => {
    if (input.length < 2) return;
    try {
      const res = await api.post("/ai/suggest-skills", { text: input });
      console.log("Skill suggestions:", res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Navigation
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const handleSubmit = async () => {
    try {
      await api.post("/profile", profile);
      navigate("/profile-preview");
    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress bar and save status */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Profile Completion</span>
          <span className="font-semibold">{profile.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${profile.progress}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2 flex items-center">
          <span
            className={`inline-block w-2 h-2 rounded-full mr-2 ${savedStatus === "Profile saved" ? "bg-green-500" : "bg-yellow-500"}`}
          ></span>
          {savedStatus}
        </p>
      </div>

      {/* Step indicators */}
      <div className="flex flex-wrap justify-between mb-8 border-b">
        {[
          "Basic",
          "Contact",
          "Experience",
          "Skills",
          "Projects",
          "Education",
          "Review",
        ].map((label, i) => (
          <button
            key={i}
            className={`pb-2 px-2 md:px-4 text-sm md:text-base ${step === i + 1 ? "border-b-2 border-blue-600 text-blue-600 font-semibold" : "text-gray-500"}`}
            onClick={() => setStep(i + 1)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4">Basic Information</h2>
          <label className="block mb-2 font-medium">
            Professional Headline
          </label>
          <input
            type="text"
            value={profile.headline}
            onChange={(e) => handleChange("headline", e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
            placeholder="e.g., Full Stack Developer"
          />
          <label className="block mb-2 font-medium">Summary</label>
          <textarea
            value={profile.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
            rows="4"
            placeholder="Tell us about yourself..."
          />
          <button
            onClick={generateSummary}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            ✨ Generate with AI
          </button>
        </div>
      )}

      {/* Step 2: Contact Info */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Phone Number</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full border rounded-lg p-2"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full border rounded-lg p-2"
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">LinkedIn Profile</label>
              <input
                type="url"
                value={profile.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                className="w-full border rounded-lg p-2"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">GitHub Profile</label>
              <input
                type="url"
                value={profile.github}
                onChange={(e) => handleChange("github", e.target.value)}
                className="w-full border rounded-lg p-2"
                placeholder="https://github.com/username"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Experience */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4">Work Experience</h2>
          {profile.experience.map((exp, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg mb-4 bg-gray-50 relative"
            >
              <button
                onClick={() => removeExperience(index)}
                className="absolute top-2 right-2 text-red-500"
              >
                ✕
              </button>
              <input
                type="text"
                placeholder="Job Title"
                value={exp.title}
                onChange={(e) =>
                  updateExperience(index, "title", e.target.value)
                }
                className="w-full border rounded-lg p-2 mb-2"
              />
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) =>
                  updateExperience(index, "company", e.target.value)
                }
                className="w-full border rounded-lg p-2 mb-2"
              />
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Start Date"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateExperience(index, "startDate", e.target.value)
                  }
                  className="w-1/2 border rounded-lg p-2"
                />
                <input
                  type="text"
                  placeholder="End Date"
                  value={exp.endDate}
                  onChange={(e) =>
                    updateExperience(index, "endDate", e.target.value)
                  }
                  className="w-1/2 border rounded-lg p-2"
                />
              </div>
              <textarea
                placeholder="Description"
                value={exp.description}
                onChange={(e) =>
                  updateExperience(index, "description", e.target.value)
                }
                className="w-full border rounded-lg p-2"
                rows="3"
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button
              onClick={addExperience}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              + Add Experience
            </button>
            <button
              onClick={() => {
                setAiField("experience");
                setShowAiModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              🤖 AI Assist
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Skills */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4">Skills</h2>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Add a skill</label>
            <div className="flex gap-2">
              <input
                type="text"
                id="skillInput"
                placeholder="e.g., React"
                className="flex-1 border rounded-lg p-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value) {
                    addSkill(e.target.value);
                    e.target.value = "";
                  }
                }}
                onChange={(e) => suggestSkills(e.target.value)}
              />
              <button
                onClick={() => {
                  const input = document.getElementById("skillInput");
                  if (input.value) {
                    addSkill(input.value);
                    input.value = "";
                  }
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center text-sm"
              >
                {skill}
                <button
                  onClick={() => removeSkill(idx)}
                  className="ml-2 text-red-500"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Projects */}
      {step === 5 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4">Projects</h2>
          {profile.projects.map((proj, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg mb-4 bg-gray-50 relative"
            >
              <button
                onClick={() => removeProject(index)}
                className="absolute top-2 right-2 text-red-500"
              >
                ✕
              </button>
              <input
                type="text"
                placeholder="Project Name"
                value={proj.name}
                onChange={(e) => updateProject(index, "name", e.target.value)}
                className="w-full border rounded-lg p-2 mb-2"
              />
              <textarea
                placeholder="Description"
                value={proj.description}
                onChange={(e) =>
                  updateProject(index, "description", e.target.value)
                }
                className="w-full border rounded-lg p-2 mb-2"
                rows="2"
              />
              <input
                type="text"
                placeholder="Technologies (comma separated)"
                value={proj.technologies.join(", ")}
                onChange={(e) =>
                  updateProject(index, "technologies", e.target.value)
                }
                className="w-full border rounded-lg p-2 mb-2"
              />
              <input
                type="url"
                placeholder="Project Link (optional)"
                value={proj.link}
                onChange={(e) => updateProject(index, "link", e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button
              onClick={addProject}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              + Add Project
            </button>
            <button
              onClick={() => {
                setAiField("projects");
                setShowAiModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              🤖 AI Assist
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Education */}
      {step === 6 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4">Education</h2>
          {profile.education.map((edu, index) => (
            <div
              key={index}
              className="border p-4 rounded-lg mb-4 bg-gray-50 relative"
            >
              <button
                onClick={() => removeEducation(index)}
                className="absolute top-2 right-2 text-red-500"
              >
                ✕
              </button>
              <input
                type="text"
                placeholder="Degree"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(index, "degree", e.target.value)
                }
                className="w-full border rounded-lg p-2 mb-2"
              />
              <input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) =>
                  updateEducation(index, "institution", e.target.value)
                }
                className="w-full border rounded-lg p-2 mb-2"
              />
              <input
                type="text"
                placeholder="Year"
                value={edu.year}
                onChange={(e) => updateEducation(index, "year", e.target.value)}
                className="w-full border rounded-lg p-2"
              />
            </div>
          ))}
          <button
            onClick={addEducation}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Education
          </button>
        </div>
      )}

      {/* Step 7: Review */}
      {step === 7 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl mb-4">Review Your Profile</h2>
          <div className="space-y-3">
            <p>
              <strong>Headline:</strong> {profile.headline || "(not set)"}
            </p>
            <p>
              <strong>Summary:</strong> {profile.summary || "(not set)"}
            </p>
            <p>
              <strong>Phone:</strong> {profile.phone || "(not set)"}
            </p>
            <p>
              <strong>Location:</strong> {profile.location || "(not set)"}
            </p>
            <p>
              <strong>LinkedIn:</strong> {profile.linkedin || "(not set)"}
            </p>
            <p>
              <strong>GitHub:</strong> {profile.github || "(not set)"}
            </p>
            <p>
              <strong>Skills:</strong>{" "}
              {profile.skills.length > 0 ? profile.skills.join(", ") : "(none)"}
            </p>
            <p>
              <strong>Experience:</strong> {profile.experience.length} entries
            </p>
            <p>
              <strong>Projects:</strong> {profile.projects.length} entries
            </p>
            <p>
              <strong>Education:</strong> {profile.education.length} entries
            </p>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Previous
          </button>
        )}
        {step < 7 ? (
          <button
            onClick={nextStep}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 ml-auto"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 ml-auto"
          >
            Submit Profile
          </button>
        )}
      </div>

      {/* AI Assist Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-xl mb-4">
              AI Assist - Describe your {aiField}
            </h3>
            <textarea
              className="w-full border rounded-lg p-3 mb-4 h-40"
              placeholder={
                aiField === "experience"
                  ? "Paste your experience details...\nExample:\nSoftware Engineer at Google (2020 - 2023) Worked on search algorithms..."
                  : "Paste your project details..."
              }
              value={aiAssistText}
              onChange={(e) => setAiAssistText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAIAssist}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Parse with AI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBuilder;
