// src/pages/JobsPage.js
import React, { useEffect, useState } from "react";
import api from "../api";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]); // NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch user profile to get skills
        const profileRes = await api.get("/profiles/me");
        const skills = profileRes.data?.skills || [];
        setUserSkills(skills);

        // 2. Fetch jobs
        const jobsRes = await api.get("/jobs");
        const data = jobsRes.data?.jobs || jobsRes.data;
        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          setError("Could not fetch jobs");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(jobs);

  const formatSalary = (salaryRange) => {
    if (!salaryRange) return "Salary not specified";
    const [min, max] = salaryRange.split("-");
    return `${parseInt(min).toLocaleString()} - ${parseInt(max).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30)
      return `${Math.ceil(diffDays / 7)} week${
        Math.ceil(diffDays / 7) > 1 ? "s" : ""
      } ago`;
    return date.toLocaleDateString();
  };

  // Filter jobs: matches search AND user skills
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Check skill match
    const hasSkillMatch =
      userSkills.length === 0 ||
      (job.skillsRequired &&
        job.skillsRequired.some((skill) =>
          userSkills.some(
            (us) => us.toLowerCase().trim() === skill.toLowerCase().trim()
          )
        ));

    return matchesSearch && hasSkillMatch;
  });

  if (loading) {
    return (
      <div className="bg-gradient-primary min-vh-100 vw-100 d-flex align-items-center justify-content-center text-white">
        <div className="text-center">
          <div className="spinner-border spinner-border-lg mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4>Finding amazing opportunities...</h4>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-primary min-vh-100 vw-100 d-flex align-items-center justify-content-center text-white">
        <div className="text-center">
          <h4>{error}</h4>
          <button
            className="btn btn-outline-light mt-3"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      {/* include your style tags here … (from your previous version) */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }
        
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          width: 100vw;
          min-height: 100vh;
          position: relative;
        }
        
        .floating-elements::before {
          content: '';
          position: absolute;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          top: 10%;
          right: 5%;
          animation: float 8s ease-in-out infinite;
          z-index: 1;
        }
        
        .floating-elements::after {
          content: '';
          position: absolute;
          width: 250px;
          height: 250px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          bottom: 10%;
          left: 5%;
          animation: float 10s ease-in-out infinite reverse;
          z-index: 1;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out;
        }
        
        .card-glass {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 2;
          overflow: hidden;
        }
        
        .card-glass::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2, #667eea);
          background-size: 200% 100%;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0%, 100% { background-position: 200% 0; }
          50% { background-position: -200% 0; }
        }
        
        .card-glass:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0,0,0,0.15);
          background: rgba(255, 255, 255, 0.98);
        }
        
        .btn-gradient {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          border-radius: 12px;
          padding: 12px 24px;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          color: #fff;
          position: relative;
          overflow: hidden;
        }
        
        .btn-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.6s ease;
        }
        
        .btn-gradient:hover::before {
          left: 100%;
        }
        
        .btn-gradient:hover {
          background: linear-gradient(45deg, #5a67d8, #6b46c1);
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4);
          color: #fff;
        }
        
        .btn-outline-glass {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .btn-outline-glass:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          color: white;
        }
        
        .search-container {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.15);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .form-control-glass {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .form-control-glass:focus {
          background: rgba(255, 255, 255, 1);
          border-color: #667eea;
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
          transform: translateY(-2px);
        }
        
        .job-tag {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          border: 1px solid rgba(102, 126, 234, 0.2);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
          margin: 2px;
        }
        
        .company-badge {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 6px 16px;
          border-radius: 25px;
          font-size: 0.8rem;
          font-weight: 600;
          display: inline-block;
        }
        
        .stats-card {
          backdrop-filter: blur(15px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          color: white;
          text-align: center;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }
        
        .stats-card:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
        }
        
        .header-glass {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 2rem;
          margin-bottom: 3rem;
          text-align: center;
        }
      `}</style>

      <div className="bg-gradient-primary floating-elements mainContainer">
        <div className="container-fluid px-4 py-5">
          {/* Header */}
          <div className="header-glass animate-fade-in-up mb-5">
            <h1 className="display-4 fw-bold text-white mb-3">🚀 Discover Your Dream Job</h1>
            <p className="lead text-white opacity-90 mb-4">
              Explore opportunities from top companies worldwide
            </p>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="stats-card">
                  <h3 className="fw-bold mb-1">{jobs.length}</h3>
                  <small>Active Jobs</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stats-card">
                  <h3 className="fw-bold mb-1">{userSkills.length}</h3>
                  <small>Your Skills</small>
                </div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="search-container animate-slide-in-left">
            <div className="row g-3">
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-glass"
                  placeholder="🔍 Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <button
                  className="btn btn-outline-glass w-100"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              </div>
            </div>
          </div>

          {/* Count */}
          <div className="mb-4">
            <h5 className="text-white opacity-90">
              {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}{" "}
              {userSkills.length > 0 && "matching your skills"} found
            </h5>
          </div>

          {/* Jobs */}
          <div className="row g-4">
            {filteredJobs.map((job) => (
              <div key={job._id} className="col-lg-6">
                <div className="card card-glass h-100 animate-fade-in-up">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className="company-badge">{job.company}</span>
                      <small className="text-muted">{formatDate(job.createdAt)}</small>
                    </div>
                    <h4 className="card-title text-dark fw-bold mb-3">{job.title}</h4>
                    <p className="card-text text-dark mb-3 lh-sm">{job.description}</p>
                    <div className="mb-4">
                      <small className="text-muted fw-semibold d-block mb-2">
                        Skills Required:
                      </small>
                      {job.skillsRequired &&
                        job.skillsRequired.map((skill, idx) => (
                          <span key={idx} className="job-tag me-1 mb-1">
                            {skill}
                          </span>
                        ))}
                    </div>
                    <div className="d-flex gap-2 mt-auto">
                      <button
                        className="btn btn-gradient flex-fill"
                        onClick={() =>
                          (window.location.href = `/jobs/${job._id}/apply`)
                        }
                      >
                        Apply Now
                      </button>
                      <button className="btn btn-outline-secondary">Save</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-5">
              <div className="card-glass p-5">
                <h4 className="text-muted mb-3">No jobs found</h4>
                <p className="text-muted">Try adjusting your search criteria</p>
                <button
                  className="btn btn-gradient"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
