import React from "react";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Welcome to AI Recruiter! 👋
      </h1>
      <p className="text-lg mb-6 text-center text-gray-600">
        We'll help you build a standout profile using AI assistance. No resume
        upload needed.
      </p>

      <div className="bg-blue-50 p-6 rounded-lg mb-8">
        <h2 className="font-semibold text-xl mb-3 text-blue-800">
          ✨ How AI helps you:
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            Paste your experience and we'll structure it automatically.
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            Get skill suggestions as you type.
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            Generate a professional summary with one click.
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">✓</span>
            Auto-save progress and track completion.
          </li>
        </ul>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate("/profile-builder")}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Build Your Profile
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
