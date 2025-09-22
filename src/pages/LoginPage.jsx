import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../api"


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
const navigate = useNavigate();


  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulated API call - replace with your actual API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Your actual API call:
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/jobs");
      
      alert("Login successful!");
    } catch {
      setErrors({ general: "Invalid credentials" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <link 
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" 
        rel="stylesheet"
      />
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 50px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        
        .animate-slide-in {
          animation: slideInLeft 0.6s ease-out;
        }
        
        .animate-bounce-gentle {
          animation: bounce 2s infinite;
        }
        
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .card-glassmorphism {
          backdrop-filter: blur(15px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .card-hover-effect {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .card-hover-effect:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .form-control-animated {
          transition: all 0.3s ease;
          border: 2px solid #e9ecef;
        }
        
        .form-control-animated:focus {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
          border-color: #667eea;
        }
        
        .btn-gradient {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border: none;
          transition: all 0.3s ease;
        }
        
        .btn-gradient:hover {
          background: linear-gradient(45deg, #5a67d8, #6b46c1);
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
        }
        
        .logo-container {
          width: 80px;
          height: 80px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
        }
        
        .logo-container:hover {
          transform: scale(1.1);
        }
        
        .brand-title {
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .floating-elements::before {
          content: '';
          position: absolute;
          width: 100px;
          height: 100px;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 50%;
          top: 10%;
          right: 10%;
          animation: float 6s ease-in-out infinite;
        }
        
        .floating-elements::after {
          content: '';
          position: absolute;
          width: 150px;
          height: 150px;
          background: rgba(118, 75, 162, 0.1);
          border-radius: 50%;
          bottom: 10%;
          left: 10%;
          animation: float 8s ease-in-out infinite reverse;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .input-group-custom {
          position: relative;
          margin-bottom: 1.5rem;
        }
        
        .input-group-custom label {
          position: absolute;
          top: 50%;
          left: 1rem;
          transform: translateY(-50%);
          background: white;
          padding: 0 0.5rem;
          color: #6c757d;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          pointer-events: none;
          z-index: 5;
        }
        
        .input-group-custom input:focus + label,
        .input-group-custom input:not(:placeholder-shown) + label {
          top: 0;
          transform: translateY(-50%);
          font-size: 0.75rem;
          color: #667eea;
        }
      `}</style>

      <div className="bg-gradient-primary min-vh-95 d-flex align-items-center justify-content-center p-4 floating-elements">
        <div className="container" style={{ maxWidth: "500px" }}>
          <div className="card border-0 shadow-lg card-glassmorphism card-hover-effect animate-fade-in-up">
            <div className="card-body p-5">
              
              {/* Logo and Header */}
              <div className="text-center mb-5">
                <div className="logo-container animate-bounce-gentle mb-4">
                  <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                    <path d="M20 6h-2V4c0-1.11-.89-2-2-2H8c-1.11 0-2 .89-2 2v2H4c-1.11 0-2 .89-2 2v11h20V8c0-1.11-.89-2-2-2zM8 4h8v2H8V4zm12 15H4V8h16v11z"/>
                    <circle cx="12" cy="13" r="2"/>
                  </svg>
                </div>
                <h1 className="display-4 fw-bold brand-title mb-2 animate-fade-in">JobNest</h1>
                <h4 className="text-dark mb-3 animate-slide-in">Welcome Back</h4>
                <p className="text-muted animate-slide-in">Sign in to access your JobNest account</p>
              </div>

              {/* Error Alert */}
              {errors.general && (
                <div className="alert alert-danger alert-dismissible fade show animate-fade-in" role="alert">
                  <svg width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle-fill me-2" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                  </svg>
                  {errors.general}
                </div>
              )}

              {/* Login Form */}
              <div className="animate-slide-in">
                
                {/* Email Field */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark">
                    <svg width="16" height="16" fill="currentColor" className="bi bi-envelope me-2" viewBox="0 0 16 16">
                      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                    </svg>
                    Email
                  </label>
                  <input
                    className={`form-control form-control-lg form-control-animated ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Password Field */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark">
                    <svg width="16" height="16" fill="currentColor" className="bi bi-lock me-2" viewBox="0 0 16 16">
                      <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                    </svg>
                    Password
                  </label>
                  <input
                    className={`form-control form-control-lg form-control-animated ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>

                {/* Remember & Forgot */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="remember" />
                    <label className="form-check-label text-muted" htmlFor="remember">
                      Remember me
                    </label>
                  </div>
                  {/* <a href="#" className="text-decoration-none" style={{ color: '#667eea' }}>
                    Forgot Password?
                  </a> */}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  onClick={handleLogin}
                  className="btn btn-gradient btn-lg w-100 text-white fw-semibold py-3 mb-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Signing you in...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" fill="currentColor" className="bi bi-box-arrow-in-right me-2" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"/>
                        <path fillRule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                      </svg>
                      Sign In to JobNest
                    </>
                  )}
                </button>
              </div>

              {/* Footer */}
              <div className="text-center animate-fade-in">          
                <p className="text-muted mb-1">
                  New to JobNest?{" "}
                  <a href="/signup" className="text-decoration-none fw-semibold" style={{ color: '#667eea' }}>
                    Create account
                  </a>
                </p>
                <small className="text-muted">
                  Join thousands of professionals finding their dream jobs
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}