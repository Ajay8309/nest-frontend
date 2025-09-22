import React, { useState, useEffect } from "react";
import { 
  User, Mail, Target, Brain, FileText, Upload, Edit, Save, Loader, CheckCircle,
  Linkedin, Twitter, Facebook, Instagram, Download, Star, Award, ArrowRight
} from "lucide-react";
import api from "../api"; // replace with your actual API instance

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");
  const [personalityAssessment, setPersonalityAssessment] = useState("");
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [socialLinks, setSocialLinks] = useState({ linkedin: "", twitter: "", facebook: "", instagram: "" });
  
  const [existingProfile, setExistingProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Personality Assessment
  const [showAssessment, setShowAssessment] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
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
      Leader: "Natural Leader - You excel at taking charge, making decisions, and guiding teams toward success. You thrive in leadership roles and enjoy driving results.",
      Collaborator: "Team Player - You work well with others, value collaboration, and excel at building consensus. You're the glue that holds teams together.",
      Analyst: "Detail-Oriented Thinker - You approach problems systematically, pay attention to details, and excel at deep analysis. You thrive on solving complex challenges.",
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
      setPersonalityAssessment(`${result.type}: ${result.description}`);
      setAssessmentComplete(true);
      setShowAssessment(false);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer.data);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return window.btoa(binary);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profiles/me");
        setExistingProfile(res.data);
        if (res.data) {
          setName(res.data.name || "");
          setEmail(res.data.email || "");
          setSkills(res.data.skills?.join(", ") || "");
          setPersonalityAssessment(res.data.personalityAssessment || "");
          setSocialLinks(res.data.socialLinks || { linkedin: "", twitter: "", facebook: "", instagram: "" });
        }
      } catch {
        setExistingProfile(null);
      } finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!personalityAssessment) {
      alert("Please complete the personality assessment first!");
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("skills", skills);
    formData.append("personalityAssessment", personalityAssessment);
    formData.append("socialLinks", JSON.stringify(socialLinks));
    if (resume) formData.append("resume", resume);
    if (coverLetter) formData.append("coverLetter", coverLetter);

    try {
      await api.post("/profiles", formData, { headers: { "Content-Type": "multipart/form-data" } });
      alert("Profile saved successfully!");
      window.location.reload();
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

  // Personality Assessment Modal
  if (showAssessment) return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center">
      <div className="card p-5 shadow-lg">
        <h3 className="mb-4 text-center">{assessmentQuestions[currentQuestion].question}</h3>
        <div className="d-grid gap-3">
          {assessmentQuestions[currentQuestion].options.map((option, i) => (
            <button key={i} onClick={() => handleAssessmentAnswer(option)} className="btn btn-outline-primary">
              {option.text}
            </button>
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
            <h1 className="fw-bold">{existingProfile ? "Edit Profile" : "Create Profile"}</h1>
            <p className="text-muted">{existingProfile ? "Update your info" : "Fill in your details to get started"}</p>
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
              {/* Personal Info */}
              <div className="mb-4">
                <label className="form-label fw-medium">Full Name *</label>
                <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                <label className="form-label fw-medium mt-3">Email *</label>
                <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                <label className="form-label fw-medium mt-3">Skills *</label>
                <input className="form-control" value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. JavaScript, React" required />
                {skills && <div className="mt-2 d-flex flex-wrap gap-2">{skills.split(",").map((s,i)=><span key={i} className="badge bg-primary">{s.trim()}</span>)}</div>}
              </div>

              {/* Personality Assessment */}
              <div className="mb-4">
                <h5 className="fw-semibold">Personality Assessment</h5>
                {personalityAssessment ? (
                  <div className="p-3 border rounded border-success">
                    <CheckCircle className="text-success me-2" /> Assessment Completed
                    <p>{personalityAssessment.split(": ")[1]}</p>
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => { setPersonalityAssessment(""); setAnswers([]); setCurrentQuestion(0); setShowAssessment(true); }}>Retake</button>
                  </div>
                ) : (
                  <button type="button" className="btn btn-primary mt-2" onClick={() => setShowAssessment(true)}>Start Assessment</button>
                )}
              </div>

              {/* Social Links */}
              <div className="mb-4">
                <h5 className="fw-semibold">Social Links</h5>
                {["linkedin","twitter","facebook","instagram"].map(platform => (
                  <input key={platform} className="form-control mb-2" placeholder={`Enter ${platform} URL`} value={socialLinks[platform]} onChange={e => setSocialLinks({...socialLinks,[platform]:e.target.value})} />
                ))}
              </div>

              {/* Documents */}
              <div className="mb-4">
                <label className="form-label fw-medium">Resume</label>
                <input type="file" className="form-control mb-2" onChange={e => setResume(e.target.files[0])} />
                <label className="form-label fw-medium">Cover Letter</label>
                <input type="file" className="form-control" onChange={e => setCoverLetter(e.target.files[0])} />
              </div>

              <button className="btn btn-primary w-100" type="submit" disabled={submitting}>
                {submitting ? "Saving..." : existingProfile ? "Update Profile" : "Create Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
