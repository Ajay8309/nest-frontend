import React, { useState, useEffect } from "react";
import api from "../api";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [preferences, setPreferences] = useState("");
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);

  const [existingProfile, setExistingProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper: convert MongoDB buffer to Base64 string for browser
  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer.data);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profiles/me"); // GET /profiles/me
        setExistingProfile(res.data);
      } catch (err) {
        setExistingProfile(null); // profile not created yet
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("preferences", preferences);
    if (resume) formData.append("resume", resume);
    if (coverLetter) formData.append("coverLetter", coverLetter);

    try {
      await api.post("/profiles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Profile created");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error creating profile");
    }
  };

  if (loading) return <div className="text-center mt-4">Loading...</div>;

  // Show profile details if exists
  if (existingProfile) {
    return (
      <div className="col-md-6 mx-auto">
        <h2>My Profile</h2>
        <p>
          <strong>Name:</strong> {existingProfile.name}
        </p>
        <p>
          <strong>Email:</strong> {existingProfile.email}
        </p>
        {existingProfile.preferences && (
          <pre className="bg-light p-2">
            {JSON.stringify(existingProfile.preferences, null, 2)}
          </pre>
        )}
        {existingProfile.resume && (
          <a
            href={`data:${existingProfile.resume.contentType};base64,${arrayBufferToBase64(
              existingProfile.resume
            )}`}
            download="resume.pdf"
            className="btn btn-sm btn-outline-primary me-2"
          >
            Download Resume
          </a>
        )}
        {existingProfile.coverLetter && (
          <a
            href={`data:${existingProfile.coverLetter.contentType};base64,${arrayBufferToBase64(
              existingProfile.coverLetter
            )}`}
            download="coverletter.pdf"
            className="btn btn-sm btn-outline-secondary"
          >
            Download Cover Letter
          </a>
        )}
      </div>
    );
  }

  // Otherwise show form
  return (
    <form onSubmit={handleSubmit} className="col-md-6 mx-auto">
      <h2>Create Profile</h2>
      <div className="mb-3">
        <label>Name</label>
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Preferences (JSON)</label>
        <textarea
          className="form-control"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Resume</label>
        <input
          className="form-control"
          type="file"
          onChange={(e) => setResume(e.target.files[0])}
        />
      </div>
      <div className="mb-3">
        <label>Cover Letter</label>
        <input
          className="form-control"
          type="file"
          onChange={(e) => setCoverLetter(e.target.files[0])}
        />
      </div>
      <button className="btn btn-primary">Save</button>
    </form>
  );
}
