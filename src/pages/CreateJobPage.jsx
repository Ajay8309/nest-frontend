// src/pages/CreateJobPage.js
import React, { useState } from "react";
import api from "../api";

export default function CreateJobPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [company, setCompany] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/jobs", {
        title,
        description,
        company,         
        skillsRequired,
        salaryRange
      });
      alert("Job posted");
    } catch {
      alert("Error posting job");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="col-md-6 mx-auto">
      <h2>Create Job</h2>
      <input
        className="form-control mb-2"
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="form-control mb-2"
        placeholder="Company Name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <textarea
        className="form-control mb-2"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="form-control mb-2"
        placeholder="Skills (comma separated)"
        value={skillsRequired}
        onChange={(e) => setSkillsRequired(e.target.value)}
      />
      <input
        className="form-control mb-2"
        placeholder="Salary Range"
        value={salaryRange}
        onChange={(e) => setSalaryRange(e.target.value)}
      />
      <button className="btn btn-primary">Post Job</button>
    </form>
  );
}
