import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { generateResumePDF } from "../utils/pdfGenerator";
import { useAuth } from "../context/AuthContext";

const ProfilePreview = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleDownloadPDF = () => {
    if (profile && user) {
      generateResumePDF(profile, user.name, user.email);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/profile/${user.id}/public`;
    navigator.clipboard.writeText(link);
    alert("Profile link copied to clipboard!");
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (!profile)
    return (
      <div className="text-center p-10">
        <p className="mb-4">No profile found.</p>
        <button
          onClick={() => navigate("/profile-builder")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Profile
        </button>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Your Profile</h1>
        <div className="space-x-2">
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📥 Download PDF
          </button>
          <button
            onClick={handleCopyLink}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            🔗 Copy Share Link
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Profile Completion</span>
          <span className="font-semibold">{profile.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${profile.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold">{user?.name}</h2>
        <p className="text-gray-600 text-lg mb-4">{profile.headline}</p>

        {/* Contact Info */}
        {(profile.phone ||
          profile.location ||
          profile.linkedin ||
          profile.github) && (
          <div className="mb-6 border-b pb-4">
            <h3 className="text-xl font-semibold mb-2">Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {profile.phone && <p>📞 {profile.phone}</p>}
              {profile.location && <p>📍 {profile.location}</p>}
              {profile.linkedin && (
                <p>
                  🔗{" "}
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {profile.linkedin}
                  </a>
                </p>
              )}
              {profile.github && (
                <p>
                  🐙{" "}
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {profile.github}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}

        {profile.summary && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Summary</h3>
            <p className="text-gray-700">{profile.summary}</p>
          </div>
        )}

        {profile.skills?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.experience?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Experience</h3>
            {profile.experience.map((exp, i) => (
              <div key={i} className="border-l-4 border-blue-500 pl-4 mb-4">
                <p className="font-semibold text-lg">
                  {exp.title} at {exp.company}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {exp.startDate} - {exp.endDate}
                </p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        )}

        {profile.projects?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Projects</h3>
            {profile.projects.map((proj, i) => (
              <div key={i} className="mb-4">
                <p className="font-semibold text-lg">{proj.name}</p>
                <p className="text-gray-700 mb-1">{proj.description}</p>
                {proj.technologies?.length > 0 && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Technologies:</span>{" "}
                    {proj.technologies.join(", ")}
                  </p>
                )}
                {proj.link && (
                  <p className="text-sm">
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Project Link
                    </a>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {profile.education?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Education</h3>
            {profile.education.map((edu, i) => (
              <p key={i} className="mb-1">
                <span className="font-medium">{edu.degree}</span> from{" "}
                {edu.institution} ({edu.year})
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePreview;
