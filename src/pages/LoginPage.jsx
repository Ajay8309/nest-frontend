import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user)); // save user + role
      navigate("/jobs");
    } catch {
      alert("Invalid credentials");
    }
  };
  

  return (
    <form onSubmit={handleLogin} className="col-md-4 mx-auto">
      <h2>Login</h2>
      <div className="mb-3">
        <label>Email</label>
        <input className="form-control" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <input className="form-control" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>
      <button className="btn btn-primary">Login</button>
    </form>
  );
}
