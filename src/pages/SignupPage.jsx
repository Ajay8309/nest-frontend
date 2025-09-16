import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("job seeker");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", { email, password, role });
      alert("User created successfully");
      navigate("/login");
    } catch {
      alert("Error signing up");
    }
  };

  return (
    <form onSubmit={handleSignup} className="col-md-4 mx-auto">
      <h2>Signup</h2>
      <div className="mb-3">
        <label>Email</label>
        <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <div className="mb-3">
        <label>Role</label>
        <select className="form-control" value={role} onChange={e=>setRole(e.target.value)}>
          <option>job seeker</option>
          <option>employer</option>
        </select>
      </div>
      <button className="btn btn-primary">Signup</button>
    </form>
  );
}
