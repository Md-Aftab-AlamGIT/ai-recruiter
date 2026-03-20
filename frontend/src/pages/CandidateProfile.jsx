import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profile/${id}`);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleShortlist = async () => {
    try {
      await api.post(`/recruiter/shortlist/${id}`);
      alert("Candidate shortlisted successfully!");
    } catch (err) {
      alert(err.response?.data?.msg || "Error shortlisting candidate");
    }
  };

  if (loading)
    return <div className="text-center p-10">Loading profile...</div>;
  if (!profile)
    return <div className="text-center p-10">Profile not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to List
      </button>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-2">{profile.user?.name}</h1>
        <p className="text-xl text-gray-600 mb-6">{profile.headline}</p>

        {profile.summary && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Summary</h2>
            <p className="text-gray-700">{profile.summary}</p>
          </div>
        )}

        {profile.skills?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.experience?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Experience</h2>
            {profile.experience.map((exp, i) => (
              <div key={i} className="border-l-4 border-blue-500 pl-4 mb-4">
                <h3 className="font-semibold text-lg">
                  {exp.title} at {exp.company}
                </h3>
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
            <h2 className="text-2xl font-semibold mb-3">Projects</h2>
            {profile.projects.map((proj, i) => (
              <div key={i} className="mb-4">
                <h3 className="font-semibold text-lg">{proj.name}</h3>
                <p className="text-gray-700 mb-1">{proj.description}</p>
                {proj.technologies?.length > 0 && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Technologies:</span>{" "}
                    {proj.technologies.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {profile.education?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-3">Education</h2>
            {profile.education.map((edu, i) => (
              <p key={i} className="mb-1">
                <span className="font-medium">{edu.degree}</span> from{" "}
                {edu.institution} ({edu.year})
              </p>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={handleShortlist}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Shortlist Candidate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
