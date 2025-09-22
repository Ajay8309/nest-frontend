import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("job seeker");
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

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.post("/auth/signup", { email, password, role });
      alert("Account created successfully");
      navigate("/login");
    } catch {
      setErrors({ general: "Error signing up" });
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
      `}</style>

      <div className="bg-gradient-primary min-vh-100 d-flex align-items-center justify-content-center p-4 floating-elements">
        <div className="container" style={{ maxWidth: "500px" }}>
          <div className="card border-0 shadow-lg card-glassmorphism card-hover-effect animate-fade-in-up">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h1 className="display-5 fw-bold animate-fade-in" style={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Create Account
                </h1>
                <p className="text-muted animate-slide-in">
                  Join thousands of professionals on JobNest
                </p>
              </div>

              {errors.general && (
                <div className="alert alert-danger animate-fade-in">{errors.general}</div>
              )}

              <form onSubmit={handleSignup} className="animate-slide-in">
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark">Email</label>
                  <input
                    type="email"
                    className={`form-control form-control-lg form-control-animated ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold text-dark">Password</label>
                  <input
                    type="password"
                    className={`form-control form-control-lg form-control-animated ${errors.password ? "is-invalid" : ""}`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                </div>

                {/* Role */}
                <div className="mb-4">
                  <label className="form-label fw-semibold text-dark">Role</label>
                  <select
                    className="form-control form-control-lg form-control-animated"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="job seeker">Job Seeker</option>
                    <option value="employer">Employer</option>
                  </select>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn btn-gradient btn-lg w-100 text-white fw-semibold py-3 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </button>

                <div className="text-center animate-fade-in">
                  <p className="text-muted mb-0">
                    Already have an account?{" "}
                    <a href="/login" className="fw-semibold" style={{color:'#667eea'}}>Sign In</a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
