import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const Shortlist = () => {
  const [shortlisted, setShortlisted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShortlist = async () => {
      try {
        const res = await api.get("/recruiter/shortlist");
        setShortlisted(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShortlist();
  }, []);

  if (loading)
    return <div className="text-center p-10">Loading shortlist...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shortlisted Candidates</h1>

      {shortlisted.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          No shortlisted candidates yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shortlisted.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg p-5 shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{item.candidate?.name}</h2>
              <p className="text-gray-600 mb-3">{item.candidate?.email}</p>
              <Link
                to={`/candidate/${item.candidate._id}`}
                className="text-blue-600 hover:underline font-medium"
              >
                View Full Profile →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shortlist;
