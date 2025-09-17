// src/pages/EmployerJobsPage.js
import React, { useEffect, useState } from "react";
import api from "../api";

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/jobs?mine=true"); // token should be added by api.js interceptor
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

  if (loading) {
    return <div className="col-md-8 mx-auto mt-4">Loading jobs…</div>;
  }

  if (error) {
    return <div className="col-md-8 mx-auto mt-4 text-danger">{error}</div>;
  }

  return (
    <div className="col-md-8 mx-auto">
      <h2>My Posted Jobs</h2>
      {jobs.length === 0 ? (
        <div className="mt-3">You haven’t posted any jobs yet.</div>
      ) : (
        <ul className="list-group">
          {jobs.map((job) => (
            <li className="list-group-item" key={job._id}>
              <strong>{job.title}</strong> — {job.company}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
