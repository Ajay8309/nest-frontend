import React, { useEffect, useState } from "react";
import api from "../api";

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [applicantProfile, setApplicantProfile] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/jobs?mine=true");
        if (Array.isArray(res.data)) {
          setJobs(res.data);
          setError("");
        } else {
          setJobs([]);
          setError(res.data?.error || "Could not fetch jobs");
        }
      } catch (err) {
        console.error(err);
        setError("Could not fetch jobs");
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const fetchApplicants = async (jobId) => {
    try {
      setLoadingApplicants(true);
      if (selectedJobId === jobId) {
        setSelectedJobId(null);
        setApplicants([]);
        setSelectedApplicantId(null);
        setApplicantProfile(null);
      } else {
        setSelectedJobId(jobId);
        const res = await api.get(`/jobs/${jobId}/applicants`);
        setApplicants(res.data || []);
        setSelectedApplicantId(null);
        setApplicantProfile(null);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch applicants");
    } finally {
      setLoadingApplicants(false);
    }
  };

  const fetchApplicantProfile = async (applicantId) => {
    try {
      if (selectedApplicantId === applicantId) {
        setSelectedApplicantId(null);
        setApplicantProfile(null);
        return;
      }
      const res = await api.get(`/profiles/${applicantId}`);
      setApplicantProfile(res.data);
      setSelectedApplicantId(applicantId);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch applicant profile");
    }
  };

  // Download file from Buffer
  const downloadFile = (file, filename) => {
    if (!file?.data) return;
    const byteArray = new Uint8Array(file.data.data || file.data);
    const blob = new Blob([byteArray], { type: file.contentType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const sendConnectionRequest = async (userId) => {
    try {
      await api.post("/connections", { to: userId });
      alert("Connection request sent");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to send request");
    }
  };

  if (loading) return <div className="page-wrapper">Loading jobs…</div>;
  if (error) return <div className="page-wrapper text-danger">{error}</div>;

  return (
    <>
      <style>{`
        .page-wrapper { width: 100vw; min-height: 100vh; background: #f1f3f5; padding: 2rem; display: flex; flex-direction: column; align-items: center; }
        .jobs-container { width: 100%; max-width: 900px; display: flex; flex-direction: column; gap: 1.5rem; }
        .job-card { background: #fff; border-radius: 1rem; padding: 1.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.08); transition: transform 0.2s, box-shadow 0.2s; }
        .job-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.12); }
        .job-title { font-size: 1.3rem; font-weight: 600; color: #333; margin-bottom: 0.25rem; }
        .job-company { font-size: 1rem; font-weight: 500; color: #667eea; margin-bottom: 0.5rem; }
        .job-desc { font-size: 0.95rem; color: #495057; margin-bottom: 0.75rem; }
        .job-skills { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem; }
        .skill-badge { background: #e9ecef; color: #495057; font-size: 0.8rem; padding: 0.25rem 0.6rem; border-radius: 0.5rem; }
        .job-date { font-size: 0.75rem; color: #adb5bd; text-align: right; margin-bottom: 0.5rem; }
        .no-jobs { font-size: 1rem; color: #6c757d; margin-top: 2rem; }
        .applicants-section { background: #f8f9fa; padding: 1rem; border-radius: 0.75rem; border: 1px solid #e9ecef; margin-top: 0.5rem; }
        .applicant-item { padding: 0.75rem 1rem; border-bottom: 1px solid #e9ecef; cursor: pointer; border-radius: 0.5rem; margin-bottom: 0.25rem; transition: background 0.2s; }
        .applicant-item:hover { background: #e2e8f0; }
        .profile-section { background: #fff; padding: 1rem; border-radius: 0.5rem; margin-top: 0.5rem; border: 1px solid #ced4da; }
        .loading-applicants { font-size: 0.9rem; color: #6c757d; }
        .experience-item { margin-bottom: 0.25rem; padding-left: 1rem; border-left: 2px solid #adb5bd; }
        .download-btn, .connect-btn { margin-top: 0.25rem; margin-right: 0.5rem; padding: 0.25rem 0.5rem; font-size: 0.85rem; border-radius: 0.4rem; color: white; border: none; cursor: pointer; transition: background 0.2s; }
        .download-btn { background-color: #667eea; }
        .download-btn:hover { background-color: #4c63c7; }
        .connect-btn { background-color: #28a745; }
        .connect-btn:hover { background-color: #218838; }
      `}</style>

      <div className="page-wrapper">
        <h2 style={{ marginBottom: "1.5rem" }}>My Posted Jobs</h2>
        <div className="jobs-container">
          {jobs.length === 0 ? (
            <div className="no-jobs">You haven’t posted any jobs yet.</div>
          ) : (
            jobs.map((job) => (
              <div className="job-card" key={job._id}>
                <div className="job-title">{job.title}</div>
                <div className="job-company">{job.company}</div>
                <div className="job-desc">{job.description}</div>
                <div className="job-skills">
                  {job.skillsRequired.map((skill, i) => <span key={i} className="skill-badge">{skill}</span>)}
                </div>
                <div className="job-date">Posted on {new Date(job.createdAt).toLocaleDateString()}</div>

                <div style={{ marginTop: "0.5rem" }}>
                  <button
                    className="download-btn"
                    onClick={() => fetchApplicants(job._id)}
                    disabled={loadingApplicants}
                  >
                    {selectedJobId === job._id ? "Hide Applicants" : "View Applicants"}
                  </button>
                </div>

                {selectedJobId === job._id && (
                  <div className="applicants-section">
                    {loadingApplicants ? (
                      <div className="loading-applicants">Loading applicants…</div>
                    ) : applicants.length === 0 ? (
                      <div className="loading-applicants">No applicants yet</div>
                    ) : (
                      applicants.map((app) => (
                        <div key={app._id}>
                          <div
                            className="applicant-item"
                            onClick={() => fetchApplicantProfile(app.user._id)}
                          >
                            {app.user.name || app.user.email}
                          </div>

                          {selectedApplicantId === app.user._id && applicantProfile && (
                            <div className="profile-section">
                              <div><strong>Name:</strong> {applicantProfile.name}</div>
                              <div><strong>Email:</strong> {applicantProfile.email}</div>
                              <div><strong>Skills:</strong> {applicantProfile.skills?.join(", ") || "N/A"}</div>
                              <div><strong>Experience:</strong></div>
                              {applicantProfile.experience?.length > 0 ? (
                                applicantProfile.experience.map((exp, i) => (
                                  <div key={i} className="experience-item">
                                    {exp.role} at {exp.companyName} — {exp.years} yrs
                                  </div>
                                ))
                              ) : (
                                <div className="experience-item">N/A</div>
                              )}
                              <div><strong>Personality type:</strong> {applicantProfile.personalityAssessment || "N/A"}</div>
                              <div><strong>Education:</strong> {applicantProfile.education || "N/A"}</div>
                              <div><strong>Bio:</strong> {applicantProfile.bio || "N/A"}</div>

                              {/* Resume & Cover Letter */}
                              <div style={{ marginTop: "0.5rem" }}>
                                {app.resume?.data && (
                                  <button
                                    className="download-btn"
                                    onClick={() => downloadFile(app.resume, "resume.pdf")}
                                  >
                                    Download Resume
                                  </button>
                                )}
                                {app.coverLetter?.data && (
                                  <button
                                    className="download-btn"
                                    onClick={() => downloadFile(app.coverLetter, "coverLetter.pdf")}
                                  >
                                    Download Cover Letter
                                  </button>
                                )}

                                {/* Connection Request */}
                                <button
                                  className="connect-btn"
                                  onClick={() => sendConnectionRequest(app.user._id)}
                                >
                                  Send Connection Request
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
