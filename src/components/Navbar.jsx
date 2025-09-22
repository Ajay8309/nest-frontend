import { Link, useNavigate } from "react-router-dom";
import React from "react";
import { Briefcase, User, MessageSquare, Building2, Plus, Users } from "lucide-react";

export default function Navbar() {

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleNavClick = (path) => {
    console.log(`Navigate to: ${path}`);
    navigate(path);
  };

  return (
    <>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
        <div className="container-fluid">
          {/* Brand */}
          <button 
            onClick={() => handleNavClick("/")}
            className="navbar-brand btn btn-link text-decoration-none d-flex align-items-center p-0"
          >
            <div 
              className="rounded me-2 d-flex align-items-center justify-content-center"
              style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
              }}
            >
              <Briefcase size={18} color="white" />
            </div>
            <span 
              className="fw-bold fs-4"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              JobNest
            </span>
          </button>

          {token && (
            <button 
              className="navbar-toggler border-0 shadow-none" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          )}

          {/* Navigation */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {token && role === "job seeker" && (
                <>
                  <li className="nav-item">
                    <button 
                      onClick={() => handleNavClick("/profile")}
                      className="nav-link btn btn-link text-decoration-none d-flex align-items-center"
                    >
                      <User size={16} className="me-1" />
                      Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      onClick={() => handleNavClick("/jobs")}
                      className="nav-link btn btn-link text-decoration-none d-flex align-items-center"
                    >
                      <Briefcase size={16} className="me-1" />
                      Jobs
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      onClick={() => handleNavClick("/connections")}
                      className="nav-link btn btn-link text-decoration-none d-flex align-items-center"
                    >
                      <Users size={16} className="me-1" />
                      Connections
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      onClick={() => handleNavClick("/messages")}
                      className="nav-link btn btn-link text-decoration-none d-flex align-items-center"
                    >
                      <MessageSquare size={16} className="me-1" />
                      Messages
                    </button>
                  </li>
                </>
              )}

              {token && role === "employer" && (
                <>
                  <li className="nav-item">
                    <button 
                      onClick={() => handleNavClick("/employer/jobs")}
                      className="nav-link btn btn-link text-decoration-none d-flex align-items-center"
                    >
                      <Briefcase size={16} className="me-1" />
                      My Jobs
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      onClick={() => handleNavClick("/employer/company")}
                      className="nav-link btn btn-link text-decoration-none d-flex align-items-center"
                    >
                      <Building2 size={16} className="me-1" />
                      Company Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      onClick={() => handleNavClick("/employer/jobs/new")}
                      className="nav-link btn btn-link text-decoration-none d-flex align-items-center"
                    >
                      <Plus size={16} className="me-1" />
                      Post Job
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      onClick={() => handleNavClick("/connections")}
                      className="nav-link btn btn-link text-decoration-none d-flex align-items-center"
                    >
                      <Users size={16} className="me-1" />
                      Connections
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      onClick={() => handleNavClick("/messages")}
                      className="nav-link btn btn-link text-decoration-none d-flex align-items-center"
                    >
                      <MessageSquare size={16} className="me-1" />
                      Messages
                    </button>
                  </li>
                </>
              )}
            </ul>

            {/* User Actions */}
            <div className="d-flex align-items-center">
              {token ? (
                <div className="d-flex align-items-center">
                  {/* User Info */}
                  <div className="d-flex align-items-center me-3">
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center me-2"
                      style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                      }}
                    >
                      <span className="text-white fw-medium small">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="text-muted small d-none d-md-inline">{user.name}</span>
                  </div>
                  
                  {/* Logout Button */}
                  <button 
                    onClick={handleLogout}
                    className="btn btn-outline-danger btn-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <button 
                    onClick={() => handleNavClick("/login")}
                    className="btn btn-outline-primary btn-sm"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => handleNavClick("/signup")}
                    className="btn btn-sm text-white"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      border: 'none'
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Bootstrap JS CDN for mobile toggle functionality */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/js/bootstrap.bundle.min.js"></script>
    </>
  );
}