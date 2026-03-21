import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const CandidateList = () => {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await api.get("/profile/all");
        // Filter out candidates without a valid user object
        const validCandidates = (res.data || []).filter(
          (c) => c.user && c.user._id,
        );
        setCandidates(validCandidates);
        setFilteredCandidates(validCandidates);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  useEffect(() => {
    let filtered = candidates;
    if (search) {
      filtered = filtered.filter(
        (c) =>
          c.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.headline?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (skillFilter) {
      filtered = filtered.filter((c) =>
        c.skills?.some((skill) =>
          skill.toLowerCase().includes(skillFilter.toLowerCase()),
        ),
      );
    }
    setFilteredCandidates(filtered);
  }, [search, skillFilter, candidates]);

  const handleShortlist = async (candidateId) => {
    if (!candidateId) return;
    try {
      await api.post(`/recruiter/shortlist/${candidateId}`);
      alert("Candidate shortlisted successfully!");
    } catch (err) {
      alert(err.response?.data?.msg || "Error shortlisting candidate");
    }
  };

  if (loading)
    return <div className="text-center p-10">Loading candidates...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Candidate Dashboard</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name or headline"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Filter by skill (e.g., React)"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          className="border rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Results count */}
      <p className="mb-4 text-gray-600">
        Showing {filteredCandidates.length} of {candidates.length} candidates
      </p>

      {/* Candidate Cards */}
      {filteredCandidates.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          No candidates found matching your criteria.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate._id}
              className="border rounded-lg p-5 shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">
                {candidate.user?.name || "Unknown"}
              </h2>
              <p className="text-gray-600 mb-3">
                {candidate.headline || "No headline"}
              </p>

              <div className="mb-3">
                <p className="text-sm font-medium">Skills:</p>
                <p className="text-sm text-gray-600">
                  {candidate.skills?.slice(0, 5).join(", ")}
                  {candidate.skills?.length > 5 && "..."}
                </p>
              </div>

              <div className="flex justify-between text-sm text-gray-600 mb-4">
                <span>📁 {candidate.experience?.length || 0} exp</span>
                <span>📊 {candidate.projects?.length || 0} projects</span>
              </div>

              <div className="flex justify-between items-center">
                <Link
                  to={`/candidate/${candidate.user?._id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  View Profile
                </Link>
                <button
                  onClick={() => handleShortlist(candidate.user?._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                >
                  Shortlist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateList;
