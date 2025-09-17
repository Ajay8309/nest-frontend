// src/pages/EmployerCompanyPage.js
import React, { useState, useEffect } from "react";
import api from "../api";

export default function EmployerCompanyPage() {
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [existingProfile, setExistingProfile] = useState(null);

  useEffect(() => {
    api.get("/profiles/me")
      .then(res => setExistingProfile(res.data))
      .catch(() => setExistingProfile(null));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/profiles", {
        companyName,
        companyDescription,
      });
      alert("Company profile saved");
    } catch {
      alert("Error saving company profile");
    }
  };

  if (existingProfile?.companyName) {
    return (
      <div className="col-md-6 mx-auto">
        <h2>Company Profile</h2>
        <p><strong>Name:</strong> {existingProfile.companyName}</p>
        <p><strong>Description:</strong> {existingProfile.companyDescription}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="col-md-6 mx-auto">
      <h2>Create Company Profile</h2>
      <input
        className="form-control mb-2"
        placeholder="Company Name"
        value={companyName}
        onChange={e=>setCompanyName(e.target.value)}
      />
      <textarea
        className="form-control mb-2"
        placeholder="Company Description"
        value={companyDescription}
        onChange={e=>setCompanyDescription(e.target.value)}
      />
      <button className="btn btn-primary">Save</button>
    </form>
  );
}
