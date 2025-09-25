import React, { useState, useEffect } from "react";
import { CheckCircle, Loader } from "lucide-react";
import api from "../api";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
    personalityAssessment: "",
    socialLinks: { linkedin: "", twitter: "", facebook: "", instagram: "" },
    experience: [],
    resume: null,
    coverLetter: null
  });

  const [showAssessment, setShowAssessment] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  const assessmentQuestions = [
    {
      question: "When working on a team project, I prefer to:",
      options: [
        { text: "Take the lead and organize everyone", type: "Leader" },
        { text: "Support others and help where needed", type: "Collaborator" },
        { text: "Focus on my specific tasks independently", type: "Analyst" },
        { text: "Come up with creative solutions", type: "Innovator" }
      ]
    },
    {
      question: "In problem-solving situations, I tend to:",
      options: [
        { text: "Break down complex problems systematically", type: "Analyst" },
        { text: "Think outside the box for unique solutions", type: "Innovator" },
        { text: "Gather input from team members", type: "Collaborator" },
        { text: "Make quick decisions and move forward", type: "Leader" }
      ]
    },
    {
      question: "My ideal work environment is:",
      options: [
        { text: "Dynamic and fast-paced with quick decisions", type: "Leader" },
        { text: "Collaborative with lots of team interaction", type: "Collaborator" },
        { text: "Quiet and focused for deep work", type: "Analyst" },
        { text: "Flexible and open to experimentation", type: "Innovator" }
      ]
    },
    {
      question: "When facing a deadline, I:",
      options: [
        { text: "Create a detailed plan and stick to it", type: "Analyst" },
        { text: "Rally the team and coordinate efforts", type: "Leader" },
        { text: "Work closely with others to divide tasks", type: "Collaborator" },
        { text: "Find creative shortcuts and efficient methods", type: "Innovator" }
      ]
    },
    {
      question: "I feel most energized when:",
      options: [
        { text: "Leading a successful project", type: "Leader" },
        { text: "Helping teammates achieve their goals", type: "Collaborator" },
        { text: "Solving complex technical challenges", type: "Analyst" },
        { text: "Creating something completely new", type: "Innovator" }
      ]
    }
  ];

  const calculatePersonalityType = () => {
    const scores = { Leader: 0, Collaborator: 0, Analyst: 0, Innovator: 0 };
    answers.forEach(ans => { scores[ans.type]++; });
    const maxScore = Math.max(...Object.values(scores));
    const type = Object.keys(scores).find(key => scores[key] === maxScore);
    const descriptions = {
      Leader: "Natural Leader - You excel at taking charge, making decisions, and guiding teams toward success.",
      Collaborator: "Team Player - You work well with others, value collaboration, and excel at building consensus.",
      Analyst: "Detail-Oriented Thinker - You approach problems systematically, pay attention to details, and excel at deep analysis.",
      Innovator: "Creative Problem Solver - You think outside the box, enjoy experimenting with new ideas, and excel at finding unique solutions."
    };
    return { type, description: descriptions[type] };
  };

  const handleAssessmentAnswer = (option) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const result = calculatePersonalityType();
      setFormData(prev => ({
        ...prev,
        personalityAssessment: `${result.type}: ${result.description}`
      }));
      setShowAssessment(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profiles/me");
        if (res.data) {
          setProfile(res.data);
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            skills: res.data.skills?.join(", ") || "",
            personalityAssessment: res.data.personalityAssessment || "",
            socialLinks: res.data.socialLinks || { linkedin: "", twitter: "", facebook: "", instagram: "" },
            experience: res.data.experience || [],
            resume: null,
            coverLetter: null
          });
        }
      } catch (err) {
        console.log(err);
      } finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleExperienceChange = (index, field, value) => {
    const newExp = [...formData.experience];
    newExp[index][field] = value;
    setFormData(prev => ({ ...prev, experience: newExp }));
  };

  const handleAddExperience = () => {
    setFormData(prev => ({ ...prev, experience: [...prev.experience, { companyName: "", role: "", years: "" }] }));
  };

  const handleRemoveExperience = (index) => {
    const newExp = [...formData.experience];
    newExp.splice(index, 1);
    setFormData(prev => ({ ...prev, experience: newExp }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("skills", formData.skills);
      data.append("personalityAssessment", formData.personalityAssessment);
      data.append("socialLinks", JSON.stringify(formData.socialLinks));
      data.append("experience", JSON.stringify(formData.experience));
      if (formData.resume) data.append("resume", formData.resume);
      if (formData.coverLetter) data.append("coverLetter", formData.coverLetter);

      let res;
      if (profile) {
        res = await api.put("/profiles", data, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        res = await api.post("/profiles", data, { headers: { "Content-Type": "multipart/form-data" } });
      }
      setProfile(res.data);
      setEditMode(false);
      alert("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Loader size={48} className="text-primary animate-spin" />
    </div>
  );

  if (showAssessment) return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
      <div className="card p-5 shadow-lg">
        <h3 className="mb-4 text-center">{assessmentQuestions[currentQuestion].question}</h3>
        <div className="d-grid gap-3">
          {assessmentQuestions[currentQuestion].options.map((option, i) => (
            <button key={i} onClick={() => handleAssessmentAnswer(option)} className="btn btn-outline-primary">{option.text}</button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center mb-4">
          <div className="col-lg-8 text-center">
            <h1 className="fw-bold">{editMode ? "Edit Profile" : "Profile"}</h1>
            <p className="text-muted">{editMode ? "Update your info" : "View your profile information"}</p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            {editMode ? (
              <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                {/* Personal Info */}
                <div className="mb-4">
                  <label className="form-label fw-medium">Full Name *</label>
                  <input className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                  <label className="form-label fw-medium mt-3">Email *</label>
                  <input className="form-control" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                  <label className="form-label fw-medium mt-3">Skills *</label>
                  <input className="form-control" name="skills" value={formData.skills} onChange={handleInputChange} placeholder="e.g. JavaScript, React" required />
                  {formData.skills && <div className="mt-2 d-flex flex-wrap gap-2">{formData.skills.split(",").map((s,i)=><span key={i} className="badge bg-primary">{s.trim()}</span>)}</div>}
                </div>

                {/* Experience */}
                <div className="mb-4">
                  <h5 className="fw-semibold">Experience</h5>
                  {formData.experience.map((exp, i) => (
                    <div key={i} className="border p-3 rounded mb-2">
                      <input className="form-control mb-1" placeholder="Company Name" value={exp.companyName} onChange={e => handleExperienceChange(i,"companyName",e.target.value)} />
                      <input className="form-control mb-1" placeholder="Role" value={exp.role} onChange={e => handleExperienceChange(i,"role",e.target.value)} />
                      <input className="form-control" placeholder="Years" value={exp.years} onChange={e => handleExperienceChange(i,"years",e.target.value)} />
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveExperience(i)}>Remove</button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={handleAddExperience}>Add Experience</button>
                </div>

                {/* Personality Assessment */}
                <div className="mb-4">
                  <h5 className="fw-semibold">Personality Assessment</h5>
                  {formData.personalityAssessment ? (
                    <div className="p-3 border rounded border-success">
                      <CheckCircle className="text-success me-2" /> Assessment Completed
                      <p>{formData.personalityAssessment.split(": ")[1]}</p>
                      <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => { setFormData(prev => ({ ...prev, personalityAssessment: "" })); setAnswers([]); setCurrentQuestion(0); setShowAssessment(true); }}>Retake</button>
                    </div>
                  ) : (
                    <button type="button" className="btn btn-primary mt-2" onClick={() => setShowAssessment(true)}>Start Assessment</button>
                  )}
                </div>

                {/* Social Links */}
                <div className="mb-4">
                  <h5 className="fw-semibold">Social Links</h5>
                  {["linkedin","twitter","facebook","instagram"].map(platform => (
                    <input key={platform} className="form-control mb-2" placeholder={`Enter ${platform} URL`} value={formData.socialLinks[platform]} onChange={e => setFormData(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, [platform]: e.target.value } }))} />
                  ))}
                </div>

                {/* Documents */}
                <div className="mb-4">
                  <label className="form-label fw-medium">Resume</label>
                  <input type="file" className="form-control mb-2" onChange={e => setFormData(prev => ({ ...prev, resume: e.target.files[0] }))} />
                  <label className="form-label fw-medium">Cover Letter</label>
                  <input type="file" className="form-control" onChange={e => setFormData(prev => ({ ...prev, coverLetter: e.target.files[0] }))} />
                </div>

                <button className="btn btn-primary w-100" type="submit" disabled={submitting}>{submitting ? "Saving..." : "Update Profile"}</button>
              </form>
            ) : (
              <div className="card shadow-sm p-4">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">{profile?.name}</h4>
                <button className="btn btn-outline-primary btn-sm" onClick={() => setEditMode(true)}>Edit Profile</button>
              </div>

              <p><strong>Email:</strong> {profile?.email}</p>

              <div className="mb-3">
                <strong>Skills:</strong>
                <div className="mt-1 d-flex flex-wrap gap-2">
                  {profile?.skills?.map((skill,i) => (
                    <span key={i} className="badge bg-primary">{skill}</span>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <h5 className="fw-semibold">Experience</h5>
                {profile?.experience?.map((exp,i) => (
                  <div key={i} className="border p-2 rounded mb-2 bg-light">
                    <strong>{exp.companyName}</strong> - {exp.role} ({exp.years} yrs)
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <h5 className="fw-semibold">Social Links</h5>
                <div className="d-flex flex-column gap-1">
                  {Object.entries(profile?.socialLinks || {}).map(([key,value]) => value && (
                    <a key={key} href={value} target="_blank" rel="noopener noreferrer" className="text-decoration-none">{key.charAt(0).toUpperCase()+key.slice(1)}: {value}</a>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <h5 className="fw-semibold">Personality</h5>
                <p>{profile?.personalityAssessment}</p>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
