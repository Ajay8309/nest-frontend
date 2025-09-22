import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function JobApplyPage() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState({ resume: false, coverLetter: false });
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    salary: ""
  });
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJobData(res.data);
      } catch (err) {
        setJobData({
          title: "Job Title",
          company: "Company Name",
          location: "Location",
          salary: "Salary"
        });
      }
    }

    async function checkApplied() {
      try {
        const res = await api.get(`/jobs/${id}/applied`);
        setHasApplied(res.data.applied);
        if (res.data.applied) {
          setMessage("You have already applied to this job.");
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchJob();
    checkApplied();
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    if (resume) formData.append("resume", resume);
    if (coverLetter) formData.append("coverLetter", coverLetter);

    try {
      await api.post(`/jobs/${id}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Thank you for applying! We'll review your application and get back to you soon.");
      setHasApplied(true);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Something went wrong. Please try again.";
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(prev => ({ ...prev, [type]: true }));
    } else if (e.type === "dragleave") {
      setDragActive(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (type === 'resume') setResume(file);
      else setCoverLetter(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const removeFile = (type) => {
    if (type === 'resume') setResume(null);
    else setCoverLetter(null);
  };


  return (
    <>
        <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .main-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        .floating-elements::before {
          content: '';
          position: absolute;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          top: 15%;
          right: 10%;
          animation: float 8s ease-in-out infinite;
        }
        
        .floating-elements::after {
          content: '';
          position: absolute;
          width: 150px;
          height: 150px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          bottom: 20%;
          left: 10%;
          animation: float 6s ease-in-out infinite reverse;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
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
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out;
        }
        
        .card-glass {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 25px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 10;
        }
        
        .card-glass:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
        
        .job-header {
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          padding: 2rem;
          border-radius: 20px 20px 0 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .job-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          z-index: -1;
        }
        
        .file-upload-area {
          border: 2px dashed #dee2e6;
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          background: rgba(248, 249, 250, 0.5);
          cursor: pointer;
          position: relative;
        }
        
        .file-upload-area:hover {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
          transform: translateY(-2px);
        }
        
        .file-upload-area.drag-active {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          transform: scale(1.02);
        }
        
        .file-upload-area.has-file {
          border-color: #28a745;
          background: rgba(40, 167, 69, 0.05);
        }
        
        .upload-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          transition: all 0.3s ease;
        }
        
        .file-upload-area:hover .upload-icon {
          transform: scale(1.1);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
        
        .file-info {
          background: rgba(40, 167, 69, 0.1);
          border: 1px solid rgba(40, 167, 69, 0.2);
          border-radius: 10px;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .file-details {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .file-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #28a745, #20c997);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .btn-gradient {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          border-radius: 15px;
          padding: 15px 40px;
          font-weight: 600;
          color: white;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          min-width: 200px;
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
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
          color: white;
        }
        
        .btn-gradient:disabled {
          background: #6c757d;
          transform: none;
          box-shadow: none;
          cursor: not-allowed;
        }
        
        .btn-remove {
          background: linear-gradient(45deg, #dc3545, #c82333);
          border: none;
          border-radius: 8px;
          padding: 8px 12px;
          color: white;
          transition: all 0.3s ease;
        }
        
        .btn-remove:hover {
          background: linear-gradient(45deg, #c82333, #bd2130);
          transform: scale(1.05);
          color: white;
        }
        
        .alert-custom {
          border: none;
          border-radius: 15px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 2rem;
          position: relative;
          animation: fadeInUp 0.5s ease-out;
        }
        
        .alert-success-custom {
          background: linear-gradient(45deg, rgba(40, 167, 69, 0.1), rgba(32, 201, 151, 0.1));
          border-left: 4px solid #28a745;
          color: #155724;
        }
        
        .alert-warning-custom {
          background: linear-gradient(45deg, rgba(255, 193, 7, 0.1), rgba(255, 171, 0, 0.1));
          border-left: 4px solid #ffc107;
          color: #856404;
        }
        
        .progress-bar-custom {
          height: 6px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 3px;
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .form-label-custom {
          font-weight: 600;
          color: #495057;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .requirement-badge {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .optional-badge {
          background: rgba(108, 117, 125, 0.1);
          color: #6c757d;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }
        
        .tips-section {
          background: rgba(102, 126, 234, 0.05);
          border: 1px solid rgba(102, 126, 234, 0.2);
          border-radius: 15px;
          padding: 1.5rem;
          margin-top: 2rem;
        }
        
        .tip-item {
          display: flex;
          align-items: start;
          gap: 10px;
          margin-bottom: 0.75rem;
        }
        
        .tip-icon {
          width: 20px;
          height: 20px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 0.8rem;
          flex-shrink: 0;
          margin-top: 2px;
        }
      `}</style>
      
      <div className="main-container floating-elements">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-7">
              <div className="card-glass animate-fade-in-up">
                <div className="job-header text-center">
                  <h2 className="h4 mb-2">{jobData.title}</h2>
                  <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
                    <span className="badge bg-light text-dark px-3 py-2">{jobData.company}</span>
                    <span className="badge bg-light text-dark px-3 py-2">{jobData.location}</span>
                    <span className="badge bg-light text-dark px-3 py-2">{jobData.salary}</span>
                  </div>
                </div>

                <div className="card-body p-4 p-md-5">

                  {/* Already Applied Card */}
                  {hasApplied ? (
                    <div className="alert alert-warning text-center fw-bold">
                      You have already applied to this job.
                    </div>
                  ) : (
                    <>
                      {/* Success/Error Message */}
                      {message && (
                        <div className={`alert-custom ${
                          message.toLowerCase().includes("error") ? "alert-warning-custom" : "alert-success-custom"
                        }`}>
                          <div className="d-flex align-items-center">
                            <span>{message}</span>
                          </div>
                        </div>
                      )}

                      {/* Resume Upload */}
                      <div className="mb-4">
                        <label className="form-label-custom">Resume <span className="requirement-badge">Required</span></label>
                        {!resume ? (
                          <div
                            className={`file-upload-area ${dragActive.resume ? 'drag-active' : ''}`}
                            onDragEnter={(e) => handleDrag(e, 'resume')}
                            onDragLeave={(e) => handleDrag(e, 'resume')}
                            onDragOver={(e) => handleDrag(e, 'resume')}
                            onDrop={(e) => handleDrop(e, 'resume')}
                            onClick={() => document.getElementById('resumeInput').click()}
                          >
                            <div className="upload-icon">📄</div>
                            <h5 className="mb-2">Upload Your Resume</h5>
                            <p className="text-muted mb-0">Drag and drop your resume here, or click to browse</p>
                            <input
                              id="resumeInput"
                              type="file"
                              className="d-none"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => setResume(e.target.files[0])}
                            />
                          </div>
                        ) : (
                          <div className="file-info">
                            <div className="file-details">
                              <div className="file-icon">📄</div>
                              <div>
                                <div className="fw-semibold">{resume.name}</div>
                                <small className="text-muted">{formatFileSize(resume.size)}</small>
                              </div>
                            </div>
                            <button className="btn btn-remove btn-sm" onClick={() => removeFile('resume')}>Remove</button>
                          </div>
                        )}
                      </div>

                      {/* Cover Letter Upload */}
                      <div className="mb-5">
                        <label className="form-label-custom">Cover Letter <span className="optional-badge">Optional</span></label>
                        {!coverLetter ? (
                          <div
                            className={`file-upload-area ${dragActive.coverLetter ? 'drag-active' : ''}`}
                            onDragEnter={(e) => handleDrag(e, 'coverLetter')}
                            onDragLeave={(e) => handleDrag(e, 'coverLetter')}
                            onDragOver={(e) => handleDrag(e, 'coverLetter')}
                            onDrop={(e) => handleDrop(e, 'coverLetter')}
                            onClick={() => document.getElementById('coverLetterInput').click()}
                          >
                            <div className="upload-icon">📝</div>
                            <h5 className="mb-2">Upload Cover Letter</h5>
                            <input
                              id="coverLetterInput"
                              type="file"
                              className="d-none"
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => setCoverLetter(e.target.files[0])}
                            />
                          </div>
                        ) : (
                          <div className="file-info">
                            <div className="file-details">
                              <div className="file-icon">📝</div>
                              <div>
                                <div className="fw-semibold">{coverLetter.name}</div>
                                <small className="text-muted">{formatFileSize(coverLetter.size)}</small>
                              </div>
                            </div>
                            <button className="btn btn-remove btn-sm" onClick={() => removeFile('coverLetter')}>Remove</button>
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="text-center mt-3">
                        <button
                          className="btn-gradient"
                          type="submit"
                          disabled={isLoading || !resume}
                          onClick={handleApply}
                        >
                          {isLoading ? "Submitting..." : "Submit Application"}
                        </button>
                      </div>
                    </>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
