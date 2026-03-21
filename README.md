# AI Recruiter – AI-Powered Recruitment Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-blue)](https://ai-recruiter.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-black)](https://github.com/Md-Aftab-AlamGIT/ai-recruiter)

A modern recruitment platform that replaces traditional resume uploads with an **AI‑assisted structured profile builder**. Candidates build rich profiles through a guided, intelligent process. Recruiters can view, filter, and shortlist candidates with ease.

---

## 🚀 Problem Statement

Traditional hiring platforms rely on **resume uploads (PDFs)** which lead to:
- Poor parsing & inconsistent data
- Inherent bias
- Inefficient manual screening

**Our solution** replaces “Upload Resume” with **Smart Profile Creation**, using AI to guide users, structure data, and enable objective evaluation.

---

## ✨ Key Features

- **🧠 AI‑Assisted Profile Builder**  
  - Paste your experience → AI structures it into work entries  
  - Skill suggestions as you type  
  - One‑click generation of a professional summary  
  - Role‑based recommendations for recruiters

- **💾 Auto‑Save & Progress Tracking**  
  - Profile auto‑saves every 2 seconds  
  - Visual progress bar shows completion percentage

- **📄 Export & Share**  
  - Download your profile as a professional PDF resume  
  - Copy a public shareable link

- **👥 Recruiter Dashboard**  
  - View all candidates with filter by name, headline, or skill  
  - Shortlist promising candidates  
  - Compare candidates side‑by‑side

- **🔐 Secure Authentication**  
  - JWT‑based login/registration  
  - Role‑based access (candidate vs recruiter)

---

## 🛠 Tech Stack

| Layer       | Technology                          | Justification |
|-------------|-------------------------------------|---------------|
| Frontend    | React + Tailwind CSS                | Fast UI development with responsive, modern styling |
| Backend     | Node.js + Express                   | Lightweight, scalable REST API |
| Database    | MongoDB (Mongoose)                  | Flexible schema for profile data |
| AI Features | Gemini API (mock/real)              | Natural language parsing, skill suggestions, summary generation |
| Deployment  | Vercel (frontend), Render (backend) | Free, easy‑to‑use hosting with CI/CD |

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/Md-Aftab-AlamGIT/ai-recruiter.git
cd ai-recruiter