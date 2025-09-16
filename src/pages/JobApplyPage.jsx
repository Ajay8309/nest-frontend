import React, { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function JobApplyPage() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);

  const handleApply = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (resume) formData.append("resume", resume);
    if (coverLetter) formData.append("coverLetter", coverLetter);
    await api.post(`/jobs/${id}/apply`, formData);
    alert("Applied successfully");
  };

  return (
    <form onSubmit={handleApply} className="col-md-6 mx-auto">
      <h2>Apply for Job</h2>
      <div className="mb-3">
        <label>Resume</label>
        <input className="form-control" type="file" onChange={e=>setResume(e.target.files[0])} />
      </div>
      <div className="mb-3">
        <label>Cover Letter</label>
        <input className="form-control" type="file" onChange={e=>setCoverLetter(e.target.files[0])} />
      </div>
      <button className="btn btn-primary">Apply</button>
    </form>
  );
}
