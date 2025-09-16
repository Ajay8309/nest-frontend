import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs").then(res => setJobs(res.data.jobs));
  }, []);

  return (
    <div>
      <h2>Jobs</h2>
      {jobs.map(job => (
        <div key={job._id} className="card mb-3">
          <div className="card-body">
            <h5>{job.title}</h5>
            <p>{job.description}</p>
            <Link className="btn btn-primary" to={`/jobs/${job._id}/apply`}>Apply</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
