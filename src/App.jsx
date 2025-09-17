import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import JobsPage from "./pages/JobsPage";
import JobApplyPage from "./pages/JobApplyPage";
import ConnectionsPage from "./pages/ConnectionsPage";
import MessagesPage from "./pages/MessagesPage";
import EmployerCompanyPage from './pages/EmployerCompanyPage.jsx';
import CreateJobPage from './pages/CreateJobPage.jsx';
import EmployerJobsPage from './pages/EmployerJobsPage.jsx';


function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/jobs" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/jobs" element={<PrivateRoute><JobsPage /></PrivateRoute>} />
          <Route path="/jobs/:id/apply" element={<PrivateRoute><JobApplyPage /></PrivateRoute>} />
          <Route path="/connections" element={<PrivateRoute><ConnectionsPage /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
          <Route path="/employer/company" element={<EmployerCompanyPage />} />
          <Route path="/employer/jobs/new" element={<CreateJobPage />} />
          <Route path="/employer/jobs" element={<EmployerJobsPage />} />
        </Routes>
      </div>
    </Router>
  );
}
