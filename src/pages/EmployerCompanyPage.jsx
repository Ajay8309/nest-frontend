import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Globe, 
  MapPin, 
  Users, 
  Briefcase, 
  DollarSign,
  Edit,
  Save,
  Loader,
  CheckCircle,
  FileText,
  Industry,
  Target
} from "lucide-react";
import api from "../api";

export default function EmployerCompanyPage() {
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [requiredSkills, setRequiredSkills] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [existingProfile, setExistingProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Mock API object - replace with your actual api import


  // Fetch employer profile
  useEffect(() => {
    api.get("/profiles/employer/me")
      .then(res => {
        const profile = res.data;
        setExistingProfile(profile);

        if (profile) {
          setCompanyName(profile.companyName || "");
          setCompanyDescription(profile.companyDescription || "");
          setWebsite(profile.website || "");
          setLocation(profile.location || "");
          setIndustry(profile.industry || "");
          setCompanySize(profile.companySize || "");
          setRequiredSkills(profile.jobPreferences?.requiredSkills?.join(", ") || "");
          setSalaryRange(profile.jobPreferences?.salaryRange || "");
        }
      })
      .catch(() => setExistingProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await api.post("/profiles/employer", {
        companyName,
        companyDescription,
        website,
        location,
        industry,
        companySize,
        jobPreferences: {
          requiredSkills: requiredSkills.split(",").map(s => s.trim()),
          salaryRange
        }
      });

      alert("Company profile saved successfully!");
      const newProfile = {
        companyName,
        companyDescription,
        website,
        location,
        industry,
        companySize,
        jobPreferences: {
          requiredSkills: requiredSkills.split(",").map(s => s.trim()),
          salaryRange
        }
      };
      setExistingProfile(newProfile);
      setIsEditing(false);
    } catch (error) {
      alert("Error saving company profile");
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

  // Show existing profile
  if (existingProfile?.companyName && !isEditing) {
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
              <div className="col-lg-10">
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
                      <Building2 size={32} className="text-white" />
                    </div>
                  </div>
                  <h1 className="display-6 fw-bold mb-2">{existingProfile.companyName}</h1>
                  <p className="text-muted lead">{existingProfile.industry}</p>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline-primary"
                  >
                    <Edit size={16} className="me-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="row">
                  {/* Company Info Card */}
                  <div className="col-lg-8 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                          <FileText size={20} className="text-primary me-2" />
                          <h5 className="mb-0 fw-semibold">Company Information</h5>
                        </div>
                        
                        <div className="mb-4">
                          <h6 className="text-muted small text-uppercase mb-2">About Company</h6>
                          <p className="text-dark mb-0">{existingProfile.companyDescription}</p>
                        </div>

                        <div className="row">
                          {existingProfile.website && (
                            <div className="col-md-6 mb-3">
                              <div className="d-flex align-items-center">
                                <Globe size={16} className="text-primary me-2" />
                                <div>
                                  <div className="text-muted small">Website</div>
                                  <a href={existingProfile.website} target="_blank" rel="noopener noreferrer" className="text-primary text-decoration-none">
                                    {existingProfile.website}
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {existingProfile.location && (
                            <div className="col-md-6 mb-3">
                              <div className="d-flex align-items-center">
                                <MapPin size={16} className="text-success me-2" />
                                <div>
                                  <div className="text-muted small">Location</div>
                                  <div className="fw-medium">{existingProfile.location}</div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {existingProfile.industry && (
                            <div className="col-md-6 mb-3">
                              <div className="d-flex align-items-center">
                                <Briefcase size={16} className="text-warning me-2" />
                                <div>
                                  <div className="text-muted small">Industry</div>
                                  <div className="fw-medium">{existingProfile.industry}</div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {existingProfile.companySize && (
                            <div className="col-md-6 mb-3">
                              <div className="d-flex align-items-center">
                                <Users size={16} className="text-info me-2" />
                                <div>
                                  <div className="text-muted small">Company Size</div>
                                  <div className="fw-medium">{existingProfile.companySize}</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Preferences Card */}
                  <div className="col-lg-4 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body p-4">
                        <div className="d-flex align-items-center mb-3">
                          <Target size={20} className="text-primary me-2" />
                          <h5 className="mb-0 fw-semibold">Hiring Preferences</h5>
                        </div>
                        
                        {existingProfile.jobPreferences && (
                          <>
                            <div className="mb-4">
                              <h6 className="text-muted small text-uppercase mb-2">Required Skills</h6>
                              <div className="d-flex flex-wrap gap-2">
                                {existingProfile.jobPreferences.requiredSkills.map((skill, index) => (
                                  <span 
                                    key={index}
                                    className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="d-flex align-items-center">
                              <DollarSign size={16} className="text-success me-2" />
                              <div>
                                <div className="text-muted small">Salary Range</div>
                                <div className="fw-semibold text-success">{existingProfile.jobPreferences.salaryRange}</div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Create new profile form or edit existing
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
                    <Building2 size={32} className="text-white" />
                  </div>
                </div>
                <h1 className="display-6 fw-bold mb-2">
                  {existingProfile ? 'Edit Company Profile' : 'Create Company Profile'}
                </h1>
                <p className="text-muted lead">
                  {existingProfile 
                    ? 'Update your company information and hiring preferences'
                    : 'Tell job seekers about your company and what you\'re looking for'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-lg-5">
                  <div>
                    {/* Company Information Section */}
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <Building2 size={20} className="text-primary me-2" />
                        <h5 className="mb-0 fw-semibold">Company Information</h5>
                      </div>
                      
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">Company Name *</label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="Enter company name"
                            value={companyName}
                            onChange={e => setCompanyName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">Industry</label>
                          <select 
                            className="form-select form-select-lg"
                            value={industry}
                            onChange={e => setIndustry(e.target.value)}
                          >
                            <option value="">Select industry</option>
                            <option value="Technology">Technology</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Finance">Finance</option>
                            <option value="Education">Education</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Retail">Retail</option>
                            <option value="Consulting">Consulting</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Company Description *</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          placeholder="Describe your company, culture, and what makes you unique..."
                          value={companyDescription}
                          onChange={e => setCompanyDescription(e.target.value)}
                          required
                          style={{ resize: 'vertical' }}
                        />
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">
                            <Globe size={16} className="me-1" />
                            Website
                          </label>
                          <input
                            type="url"
                            className="form-control form-control-lg"
                            placeholder="https://yourcompany.com"
                            value={website}
                            onChange={e => setWebsite(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label fw-medium">
                            <MapPin size={16} className="me-1" />
                            Location
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            placeholder="e.g. San Francisco, CA"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">
                          <Users size={16} className="me-1" />
                          Company Size
                        </label>
                        <select 
                          className="form-select form-select-lg"
                          value={companySize}
                          onChange={e => setCompanySize(e.target.value)}
                        >
                          <option value="">Select company size</option>
                          <option value="1-10 employees">1-10 employees</option>
                          <option value="11-50 employees">11-50 employees</option>
                          <option value="51-200 employees">51-200 employees</option>
                          <option value="201-500 employees">201-500 employees</option>
                          <option value="501-1000 employees">501-1000 employees</option>
                          <option value="1000+ employees">1000+ employees</option>
                        </select>
                      </div>
                    </div>

                    {/* Hiring Preferences Section */}
                    <div className="mb-4">
                      <div className="d-flex align-items-center mb-3">
                        <Target size={20} className="text-primary me-2" />
                        <h5 className="mb-0 fw-semibold">Hiring Preferences</h5>
                      </div>
                      
                      <div className="mb-3">
                        <label className="form-label fw-medium">Required Skills</label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="e.g. JavaScript, React, Node.js, Python"
                          value={requiredSkills}
                          onChange={e => setRequiredSkills(e.target.value)}
                        />
                        <div className="form-text">Separate multiple skills with commas</div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">
                          <DollarSign size={16} className="me-1" />
                          Typical Salary Range
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          placeholder="e.g. $80,000 - $120,000 per year"
                          value={salaryRange}
                          onChange={e => setSalaryRange(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Skills Preview */}
                    {requiredSkills && (
                      <div className="mb-4">
                        <label className="form-label fw-medium">Skills Preview</label>
                        <div className="d-flex flex-wrap gap-2">
                          {requiredSkills.split(",").map((skill, index) => {
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

                    {/* Submit Buttons */}
                    <div className="d-flex justify-content-end gap-3 pt-3">
                      {isEditing && (
                        <button 
                          type="button" 
                          className="btn btn-outline-secondary btn-lg px-4"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                      )}
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
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save size={18} className="me-2" />
                            {existingProfile ? 'Update Profile' : 'Save Profile'}
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
                  <h6 className="fw-semibold mb-2">💡 Tips for a great company profile:</h6>
                  <ul className="mb-0 text-muted small">
                    <li>Write a compelling company description that highlights your culture and values</li>
                    <li>Be specific about the skills you typically look for in candidates</li>
                    <li>Include your website and location to help candidates learn more</li>
                    <li>Keep your profile updated as your company grows and evolves</li>
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