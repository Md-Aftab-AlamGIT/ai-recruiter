import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import ProfileBuilder from "./pages/ProfileBuilder";
import ProfilePreview from "./pages/ProfilePreview";
import CandidateList from "./pages/CandidateList";
import CandidateProfile from "./pages/CandidateProfile";
import Shortlist from "./pages/Shortlist";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/onboarding"
            element={
              <PrivateRoute>
                <Onboarding />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile-builder"
            element={
              <PrivateRoute>
                <ProfileBuilder />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile-preview"
            element={
              <PrivateRoute>
                <ProfilePreview />
              </PrivateRoute>
            }
          />
          <Route
            path="/candidates"
            element={
              <PrivateRoute role="recruiter">
                <CandidateList />
              </PrivateRoute>
            }
          />
          <Route
            path="/candidate/:id"
            element={
              <PrivateRoute role="recruiter">
                <CandidateProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/shortlist"
            element={
              <PrivateRoute role="recruiter">
                <Shortlist />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
