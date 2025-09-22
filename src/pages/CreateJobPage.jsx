import React, { useState, useEffect } from "react";
import { 
  Briefcase, 
  Building2, 
  DollarSign, 
  FileText, 
  Users, 
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import api from "../api";

export default function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [company, setCompany] = useState(""); 
  const [companyProfile, setCompanyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  // Fetch employer profile on mount (using actual API call structure)
  useEffect(() => {
    api.get("/profiles/employer/me")
      .then(res => {
        setCompanyProfile(res.data);
        setCompany(res.data.companyName || "");
      })
      .catch(() => setCompanyProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.post("/jobs", {
        title,
        description,
        company,         
        skillsRequired: skillsRequired.split(",").map(s => s.trim()),
        salaryRange
      });
      alert("Job posted successfully!");
      
      // Clear form
      setTitle("");
      setDescription("");
      setSkillsRequired("");
      setSalaryRange("");
    } catch (error) {
      alert("Error posting job");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
          rel="stylesheet" 
        />
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
          <div className="text-center">
            <Loader size={48} className="text-primary mb-3 animate-spin" />
            <p className="text-muted">Loading your company profile...</p>
          </div>
        </div>
      </>
    );
  }

  // Show message if company profile does not exist
  if (!companyProfile) {
    return (
      <>
        <link 
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
          rel="stylesheet" 
        />
        <div className="min-vh-100 bg-light py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-body text-center p-5">
                    <div className="mb-4">
                      <AlertCircle size={64} className="text-warning" />
                    </div>
                    <h3 className="fw-bold mb-3">Company Profile Required</h3>
                    <p className="text-muted mb-4">
                      You need to create a company profile before you can post jobs. 
                      This helps job seekers learn more about your organization.
                    </p>
                    <button 
                      className="btn btn-primary btn-lg px-4"
                      onClick={() => navigate('/employer/company')}
                    >
                      <Building2 size={18} className="me-2" />
                      Create Company Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <div className="min-vh-100 bg-light py-5">
        <div className="container">
          {/* Header */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <div 
                    className="rounded-circle mx-auto d-flex align-items-center justify-content-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    <Briefcase size={32} className="text-white" />
                  </div>
                </div>
                <h1 className="display-6 fw-bold mb-2">Post a New Job</h1>
                <p className="text-muted lead">Find your next great team member with JobNest</p>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-lg-5">
                  <div>
                    {/* Company Info Section */}
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <Building2 size={20} className="text-primary me-2" />
                        <h5 className="mb-0 fw-semibold">Company Information</h5>
                      </div>
                      <div className="row">
                        <div className="col-md-8">
                          <label className="form-label fw-medium">Company Name</label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            value={company}
                            readOnly
                            style={{ backgroundColor: '#f8f9fa' }}
                          />
                          <div className="form-text">
                            <CheckCircle size={14} className="text-success me-1" />
                            Verified company profile
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-medium">Industry</label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            value={companyProfile?.industry || ""}
                            readOnly
                            style={{ backgroundColor: '#f8f9fa' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Job Details Section */}
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <FileText size={20} className="text-primary me-2" />
                        <h5 className="mb-0 fw-semibold">Job Details</h5>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-medium">Job Title *</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="e.g. Senior Software Engineer"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Job Description *</label>
                        <textarea
                          className="form-control"
                          rows="6"
                          placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                          style={{ resize: 'vertical' }}
                        />
                      </div>
                    </div>

                    {/* Requirements Section */}
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <Users size={20} className="text-primary me-2" />
                        <h5 className="mb-0 fw-semibold">Requirements</h5>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-medium">Required Skills *</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="e.g. JavaScript, React, Node.js, Python"
                          value={skillsRequired}
                          onChange={(e) => setSkillsRequired(e.target.value)}
                          required
                        />
                        <div className="form-text">Separate multiple skills with commas</div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">
                          <DollarSign size={16} className="me-1" />
                          Salary Range
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="e.g. $80,000 - $120,000 per year"
                          value={salaryRange}
                          onChange={(e) => setSalaryRange(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Skills Preview */}
                    {skillsRequired && (
                      <div className="mb-4">
                        <label className="form-label fw-medium">Skills Preview</label>
                        <div className="d-flex flex-wrap gap-2">
                          {skillsRequired.split(",").map((skill, index) => {
                            const trimmedSkill = skill.trim();
                            if (!trimmedSkill) return null;
                            return (
                              <span 
                                key={index}
                                className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill"
                                style={{ fontSize: '0.875rem' }}
                              >
                                {trimmedSkill}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="d-flex justify-content-end gap-3 pt-3">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary btn-lg px-4"
                        onClick={() => console.log("Save as draft")}
                      >
                        Save as Draft
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-lg px-4 text-white"
                        disabled={submitting}
                        onClick={handleSubmit}
                        style={{
                          background: submitting ? '#6c757d' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none'
                        }}
                      >
                        {submitting ? (
                          <>
                            <Loader size={18} className="me-2 animate-spin" />
                            Posting Job...
                          </>
                        ) : (
                          <>
                            <Briefcase size={18} className="me-2" />
                            Post Job
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="row justify-content-center mt-4">
            <div className="col-lg-8">
              <div className="card border-0 bg-primary bg-opacity-10">
                <div className="card-body p-4">
                  <h6 className="fw-semibold mb-2">💡 Tips for a great job posting:</h6>
                  <ul className="mb-0 text-muted small">
                    <li>Be specific about the role and responsibilities</li>
                    <li>Include required and nice-to-have skills</li>
                    <li>Mention your company culture and benefits</li>
                    <li>Provide a realistic salary range to attract quality candidates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>

      <style jsx>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}