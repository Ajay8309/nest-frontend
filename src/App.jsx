import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import JobsPage from "./pages/JobsPage";
import JobApplyPage from "./pages/JobApplyPage";
import MessagesPage from "./pages/MessagesPage";
import EmployerCompanyPage from "./pages/EmployerCompanyPage.jsx";
import CreateJobPage from "./pages/CreateJobPage.jsx";
import EmployerJobsPage from "./pages/EmployerJobsPage.jsx";
import { SocketProvider } from "./context/SocketContext";
import Connections from "./components/Connection";
import UserList from "./components/UserList";

function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/login" />;
}

export default function App() {
    return (
        <SocketProvider>
            <Router>
                <Navbar />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Navigate to="/jobs" />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <ProfilePage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/jobs"
                            element={
                                <PrivateRoute>
                                    <JobsPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/jobs/:id/apply"
                            element={
                                <PrivateRoute>
                                    <JobApplyPage />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/people" element={<UserList />} />
                        <Route path="/connections" element={<Connections />} />
                        <Route path="/messages/" element={<MessagesPage />} />
                        <Route
                            path="/employer/company"
                            element={<EmployerCompanyPage />}
                        />
                        <Route
                            path="/employer/jobs/new"
                            element={<CreateJobPage />}
                        />
                        <Route
                            path="/employer/jobs"
                            element={<EmployerJobsPage />}
                        />
                    </Routes>
                </div>
            </Router>
        </SocketProvider>
    );
}
