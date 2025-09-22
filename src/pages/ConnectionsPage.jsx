import React, { useEffect, useState } from "react";
import { 
  Search, 
  Users, 
  UserPlus, 
  Clock, 
  Check, 
  X, 
  Mail, 
  Loader2,
  UserCheck,
  Bell,
  Filter,
  MapPin
} from "lucide-react";
import api from "../api";


export default function ConnectionsPage() {
  const [jobSeekers, setJobSeekers] = useState([]);
  const [existingConnections, setExistingConnections] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredConnections, setFilteredConnections] = useState([]);
  const [search, setSearch] = useState("");
  const [sendingId, setSendingId] = useState(null);
  const [activeTab, setActiveTab] = useState("discover");
  const [processingRequest, setProcessingRequest] = useState(null);
  const [sentRequests, setSentRequests] = useState(new Set());
  const [filterLocation, setFilterLocation] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [removingConnection, setRemovingConnection] = useState(null);

  // ==== FETCH DATA ====
  useEffect(() => {
    fetchJobSeekers();
    fetchConnections();
    fetchIncomingRequests();
  }, []);

  const fetchJobSeekers = async () => {
    try {
      const res = await api.get("/users/jobseekers");
      setJobSeekers(res.data || []);
      setFilteredUsers(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Could not load job seekers");
    }
  };

  const fetchConnections = async () => {
    try {
      const res = await api.get("/connections/accepted"); // adjust endpoint
      setExistingConnections(res.data || []);
      setFilteredConnections(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Could not load connections");
    }
  };

  const fetchIncomingRequests = async () => {
    try {
      const res = await api.get("/connections/incoming");
      setIncomingRequests(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Could not load incoming requests");
    }
  };

  // ==== FILTERS ====
  useEffect(() => {
    let filtered = jobSeekers.filter(user => {
      const emailMatch =
        user.user?.email?.toLowerCase().includes(search.toLowerCase()) || false;
      const nameMatch =
        user.name?.toLowerCase().includes(search.toLowerCase()) || false;
      const locationMatch =
        !filterLocation ||
        (user.location &&
          user.location.toLowerCase().includes(filterLocation.toLowerCase()));
      const skillMatch =
        !filterSkill ||
        (user.skills &&
          Array.isArray(user.skills) &&
          user.skills.some(skill =>
            skill.toLowerCase().includes(filterSkill.toLowerCase())
          ));

      return (emailMatch || nameMatch) && locationMatch && skillMatch;
    });
    setFilteredUsers(filtered);
  }, [search, jobSeekers, filterLocation, filterSkill]);

  useEffect(() => {
    if (activeTab === "connections") {
      let filtered = existingConnections.filter(connection => {
        const emailMatch =
          connection.connectedUser?.email
            ?.toLowerCase()
            .includes(search.toLowerCase()) || false;
        const nameMatch =
          connection.connectedUser?.name
            ?.toLowerCase()
            .includes(search.toLowerCase()) || false;
        const locationMatch =
          !filterLocation ||
          (connection.location &&
            connection.location
              .toLowerCase()
              .includes(filterLocation.toLowerCase()));
        const skillMatch =
          !filterSkill ||
          (connection.skills &&
            Array.isArray(connection.skills) &&
            connection.skills.some(skill =>
              skill.toLowerCase().includes(filterSkill.toLowerCase())
            ));

        return (emailMatch || nameMatch) && locationMatch && skillMatch;
      });
      setFilteredConnections(filtered);
    }
  }, [search, existingConnections, filterLocation, filterSkill, activeTab]);

  // ==== ACTIONS ====
  const sendRequest = async recipientUserId => {
    setSendingId(recipientUserId);
    try {
      await api.post("/connections", { recipientProfileId: recipientUserId });
      setSentRequests(prev => new Set([...prev, recipientUserId]));
      alert("Connection request sent successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Error sending request");
    } finally {
      setSendingId(null);
    }
  };

  const handleRequestStatus = async (id, status) => {
    setProcessingRequest(id);
    try {
      await api.put(`/connections/${id}/status`, { status });
      await fetchIncomingRequests();
      await fetchConnections();
      alert(`Request ${status} successfully!`);
    } catch (err) {
      alert("Error updating request");
    } finally {
      setProcessingRequest(null);
    }
  };

  const removeConnection = async connectionId => {
    setRemovingConnection(connectionId);
    try {
      await api.delete(`/connections/${connectionId}`);
      setExistingConnections(prev =>
        prev.filter(conn => conn._id !== connectionId)
      );
      alert("Connection removed successfully");
    } catch (err) {
      alert("Error removing connection");
    } finally {
      setRemovingConnection(null);
    }
  };

  const sendMessage = userId => {
    alert(`Opening message composer for user ${userId}`);
  };

  const formatTimeAgo = dateString => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const clearFilters = () => {
    setSearch("");
    setFilterLocation("");
    setFilterSkill("");
  };

  const stats = {
    total: existingConnections.length,
    recentlyActive: existingConnections.filter(conn => {
      const lastActive = new Date(conn.lastActive);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return lastActive > dayAgo;
    }).length
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
        rel="stylesheet"
      />
      
      <div className="bg-light min-vh-100">
        <div className="container py-5">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-dark mb-3">Professional Network</h1>
            <p className="lead text-muted">Build meaningful connections with talented professionals</p>
            
            {/* Stats Cards */}
            <div className="row g-4 mt-4 justify-content-center">
              <div className="col-md-3">
                <div className="card bg-primary bg-opacity-10 border-primary border-opacity-25 text-center p-3">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <Users size={24} className="text-primary" />
                  </div>
                  <h3 className="fw-bold text-primary mb-1">{stats.total}</h3>
                  <small className="text-muted">Total Connections</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success bg-opacity-10 border-success border-opacity-25 text-center p-3">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <UserCheck size={24} className="text-success" />
                  </div>
                  <h3 className="fw-bold text-success mb-1">{stats.recentlyActive}</h3>
                  <small className="text-muted">Recently Active</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning bg-opacity-10 border-warning border-opacity-25 text-center p-3">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <Bell size={24} className="text-warning" />
                  </div>
                  <h3 className="fw-bold text-warning mb-1">{incomingRequests.length}</h3>
                  <small className="text-muted">Pending Requests</small>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="d-flex justify-content-center mb-5">
            <div className="bg-white rounded-pill shadow-sm p-1">
              <button
                onClick={() => setActiveTab("discover")}
                className={`btn px-4 py-2 rounded-pill me-1 ${activeTab === "discover" ? "btn-primary" : "btn-light"}`}
              >
                <Search size={16} className="me-2" />
                Discover People
              </button>
              <button
                onClick={() => setActiveTab("connections")}
                className={`btn px-4 py-2 rounded-pill me-1 ${activeTab === "connections" ? "btn-primary" : "btn-light"}`}
              >
                <Users size={16} className="me-2" />
                My Connections
                <span className="badge bg-secondary ms-2">{existingConnections.length}</span>
              </button>
              <button
                onClick={() => setActiveTab("requests")}
                className={`btn px-4 py-2 rounded-pill position-relative ${activeTab === "requests" ? "btn-primary" : "btn-light"}`}
              >
                <Bell size={16} className="me-2" />
                Requests
                {incomingRequests.length > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {incomingRequests.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Discover Tab */}
          {activeTab === "discover" && (
            <div>
              {/* Search and Filters */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-3">
                      <div className="position-relative">
                        <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                          <Search size={16} className="text-muted" />
                        </div>
                        <input
                          type="text"
                          className="form-control ps-5"
                          placeholder="Search by name or email..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="position-relative">
                        <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                          <MapPin size={16} className="text-muted" />
                        </div>
                        <input
                          type="text"
                          className="form-control ps-5"
                          placeholder="Filter by location..."
                          value={filterLocation}
                          onChange={(e) => setFilterLocation(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by skill..."
                        value={filterSkill}
                        onChange={(e) => setFilterSkill(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <button
                        onClick={clearFilters}
                        className="btn btn-outline-secondary w-100"
                      >
                        <Filter size={16} className="me-2" />
                        Clear Filters
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 d-flex align-items-center text-muted small">
                    <Users size={14} className="me-1" />
                    {filteredUsers.length} professionals found
                  </div>
                </div>
              </div>

              {/* Job Seekers Grid */}
              <div className="row g-4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div key={user._id} className="col-md-6 col-lg-4">
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <div 
                              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                              style={{ width: "48px", height: "48px" }}
                            >
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <h5 className="card-title fw-bold mb-1">{user.name || 'Unknown User'}</h5>
                              <div className="d-flex align-items-center text-muted small">
                                <Mail size={12} className="me-1" />
                                {user.user?.email || 'No email'}
                              </div>
                            </div>
                          </div>

                          {user.location && (
                            <div className="d-flex align-items-center text-muted small mb-2">
                              <MapPin size={12} className="me-1" />
                              {user.location}
                            </div>
                          )}

                          {user.skills && user.skills.length > 0 && (
                            <div className="mb-3">
                              <div className="d-flex flex-wrap gap-1">
                                {user.skills.slice(0, 3).map((skill, index) => (
                                  <span
                                    key={index}
                                    className="badge bg-primary bg-opacity-10 text-primary"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {user.skills.length > 3 && (
                                  <span className="badge bg-secondary bg-opacity-10 text-secondary">
                                    +{user.skills.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => sendRequest(user.user?._id)}
                            disabled={sendingId === user._id || sentRequests.has(user._id)}
                            className={`btn w-100 d-flex align-items-center justify-content-center gap-2 ${
                              sentRequests.has(user._id)
                                ? "btn-outline-success"
                                : sendingId === user._id
                                ? "btn-secondary"
                                : "btn-primary"
                            }`}
                          >
                            {sendingId === user._id ? (
                              <>
                                <Loader2 size={16} className="spinner-border spinner-border-sm" />
                                Sending...
                              </>
                            ) : sentRequests.has(user._id) ? (
                              <>
                                <UserCheck size={16} />
                                Request Sent
                              </>
                            ) : (
                              <>
                                <UserPlus size={16} />
                                Connect
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12">
                    <div className="card text-center py-5">
                      <div className="card-body">
                        <Search size={48} className="text-muted mb-3" />
                        <h5 className="card-title">No professionals found</h5>
                        <p className="card-text text-muted">Try adjusting your search criteria or filters</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* My Connections Tab */}
          {activeTab === "connections" && (
            <div>
              {/* Search and Filters for Connections */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="position-relative">
                        <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                          <Search size={16} className="text-muted" />
                        </div>
                        <input
                          type="text"
                          className="form-control ps-5"
                          placeholder="Search your connections..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="position-relative">
                        <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                          <MapPin size={16} className="text-muted" />
                        </div>
                        <input
                          type="text"
                          className="form-control ps-5"
                          placeholder="Filter by location..."
                          value={filterLocation}
                          onChange={(e) => setFilterLocation(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Filter by skill..."
                        value={filterSkill}
                        onChange={(e) => setFilterSkill(e.target.value)}
                      />
                    </div>
                    <div className="col-md-2">
                      <button
                        onClick={clearFilters}
                        className="btn btn-outline-secondary w-100"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 d-flex align-items-center text-muted small">
                    <Users size={14} className="me-1" />
                    {filteredConnections.length} connections found
                  </div>
                </div>
              </div>

              {/* Existing Connections Grid */}
              <div className="row g-4">
                {filteredConnections.length > 0 ? (
                  filteredConnections.map((connection) => {
                    const isRecentlyActive = () => {
                      const lastActive = new Date(connection.lastActive);
                      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                      return lastActive > dayAgo;
                    };

                    return (
                      <div key={connection._id} className="col-md-6 col-lg-4">
                        <div className="card h-100 shadow-sm border-0">
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                              <div className="position-relative">
                                <div 
                                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                  style={{ width: "48px", height: "48px" }}
                                >
                                  {connection.connectedUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div 
                                  className={`position-absolute bottom-0 end-0 rounded-circle border-2 border-white ${isRecentlyActive() ? 'bg-success' : 'bg-secondary'}`}
                                  style={{ width: "12px", height: "12px" }}
                                ></div>
                              </div>
                              <div>
                                <h5 className="card-title fw-bold mb-1">
                                  {connection.connectedUser?.name}
                                </h5>
                                <div className="d-flex align-items-center text-muted small">
                                  <Mail size={12} className="me-1" />
                                  {connection.connectedUser?.email}
                                </div>
                              </div>
                            </div>

                            {connection.location && (
                              <div className="d-flex align-items-center text-muted small mb-2">
                                <MapPin size={12} className="me-1" />
                                {connection.location}
                              </div>
                            )}

                            {connection.skills && connection.skills.length > 0 && (
                              <div className="mb-3">
                                <div className="d-flex flex-wrap gap-1">
                                  {connection.skills.slice(0, 3).map((skill, index) => (
                                    <span
                                      key={index}
                                      className="badge bg-primary bg-opacity-10 text-primary"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {connection.skills.length > 3 && (
                                    <span className="badge bg-secondary bg-opacity-10 text-secondary">
                                      +{connection.skills.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            <small className="text-muted d-block mb-3">
                              Connected {formatTimeAgo(connection.connectedAt)}
                            </small>

                            <div className="d-flex gap-2">
                              <button
                                onClick={() => sendMessage(connection.connectedUser?._id)}
                                className="btn btn-outline-primary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                              >
                                <MessageCircle size={14} />
                                Message
                              </button>
                              <button
                                onClick={() => removeConnection(connection._id)}
                                disabled={removingConnection === connection._id}
                                className="btn btn-outline-danger btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                              >
                                {removingConnection === connection._id ? (
                                  <>
                                    <Loader2 size={14} className="spinner-border spinner-border-sm" />
                                    Removing...
                                  </>
                                ) : (
                                  <>
                                    <UserMinus size={14} />
                                    Remove
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12">
                    <div className="card text-center py-5">
                      <div className="card-body">
                        <Users size={48} className="text-muted mb-3" />
                        <h5 className="card-title">No connections found</h5>
                        <p className="card-text text-muted">
                          Your accepted connections will appear here
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === "requests" && (
            <div className="card shadow-sm">
              <div className="card-header bg-white border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <Bell size={20} />
                  <h4 className="mb-0">Incoming Connection Requests</h4>
                </div>
                <p className="text-muted mb-0 mt-1">Manage your pending connection requests</p>
              </div>
              
              <div className="card-body p-0">
                {incomingRequests.length > 0 ? (
                  incomingRequests.map((req, index) => (
                    <div
                      key={req._id}
                      className={`p-4 d-flex align-items-center justify-content-between ${
                        index !== incomingRequests.length - 1 ? "border-bottom" : ""
                      }`}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                          style={{ width: "48px", height: "48px" }}
                        >
                          {req.requester?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h6 className="mb-1 fw-bold">{req.requester?.name || 'Unknown User'}</h6>
                          <div className="d-flex align-items-center text-muted small mb-1">
                            <Mail size={12} className="me-1" />
                            {req.requester?.email || 'No email'}
                          </div>
                          <div className="d-flex align-items-center text-muted small">
                            <Clock size={12} className="me-1" />
                            {req.createdAt ? formatTimeAgo(req.createdAt) : 'Unknown time'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => handleRequestStatus(req._id, "accepted")}
                          disabled={processingRequest === req._id}
                          className="btn btn-success d-flex align-items-center gap-2"
                        >
                          {processingRequest === req._id ? (
                            <Loader2 size={16} className="spinner-border spinner-border-sm" />
                          ) : (
                            <Check size={16} />
                          )}
                          Accept
                        </button>
                        
                        <button
                          onClick={() => handleRequestStatus(req._id, "rejected")}
                          disabled={processingRequest === req._id}
                          className="btn btn-danger d-flex align-items-center gap-2"
                        >
                          {processingRequest === req._id ? (
                            <Loader2 size={16} className="spinner-border spinner-border-sm" />
                          ) : (
                            <X size={16} />
                          )}
                          Decline
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5">
                    <Bell size={48} className="text-muted mb-3" />
                    <h5>No pending requests</h5>
                    <p className="text-muted">You're all caught up! New connection requests will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}