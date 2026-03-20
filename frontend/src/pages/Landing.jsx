import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto text-center py-20 px-4">
        <h1 className="text-5xl font-bold mb-6 text-gray-800">
          AI-Powered Recruitment
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Build your profile without a resume. Let AI help you stand out.
        </p>
        <Link
          to="/register"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Get Started
        </Link>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-8 text-gray-700">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-2">✨</div>
              <h3 className="font-semibold text-lg mb-2">AI-Assisted Input</h3>
              <p className="text-gray-600">
                Just describe your experience, AI structures it automatically.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="font-semibold text-lg mb-2">Structured Profile</h3>
              <p className="text-gray-600">
                Your data is organized into skills, projects, and experience.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="font-semibold text-lg mb-2">Recruiter Friendly</h3>
              <p className="text-gray-600">
                Recruiters can filter, search, and shortlist effortlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
