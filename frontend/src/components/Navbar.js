import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        AI Recruiter
      </Link>
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-gray-700">Hello, {user.name}</span>
            {user.role === "recruiter" ? (
              <>
                <Link
                  to="/candidates"
                  className="text-blue-600 hover:underline"
                >
                  Candidates
                </Link>
                <Link to="/shortlist" className="text-blue-600 hover:underline">
                  Shortlist
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile-builder"
                  className="text-blue-600 hover:underline"
                >
                  Build Profile
                </Link>
                <Link
                  to="/profile-preview"
                  className="text-blue-600 hover:underline"
                >
                  My Profile
                </Link>
              </>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
