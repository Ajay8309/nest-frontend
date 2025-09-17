// src/pages/JobsPage.js
import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);   // always start with an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        // your backend currently sends res.json(jobs) not {jobs:…}
        // so we must handle both possibilities:
        const data = res.data?.jobs || res.data;
        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          setError("Could not fetch jobs");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return <div className="text-center mt-4">Loading jobs...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-4 text-danger">
        {error}
      </div>
    );
  }

  return (
    <div className="col-md-8 mx-auto">
      <h2 className="mb-4">Jobs</h2>
      {jobs.length === 0 && <p>No jobs available</p>}
      {jobs.map((job) => (
        <div key={job._id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{job.title}</h5>
            <p className="card-text">{job.description}</p>
            <Link
              className="btn btn-primary"
              to={`/jobs/${job._id}/apply`}
            >
              Apply
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
