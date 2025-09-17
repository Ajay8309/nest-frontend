import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role; // 'jobseeker' or 'employer'

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">JobNest</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            {token && role === "job seeker" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/jobs">Jobs</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/connections">Connections</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/messages">Messages</Link>
                </li>
              </>
            )}

            {token && role === "employer" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/employer/jobs">My Jobs</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/employer/company">Company Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/employer/jobs/new">Post Job</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/messages">Messages</Link>
                </li>
              </>
            )}
          </ul>

          {token ? (
            <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link className="btn btn-outline-primary me-2" to="/login">Login</Link>
              <Link className="btn btn-primary" to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
