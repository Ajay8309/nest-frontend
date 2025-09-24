import React, { useEffect, useState } from "react";
import api from "../api";

export default function Connections() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);

  const fetchPending = async () => {
    try {
      const res = await api.get("/connections/pending");
      setPendingRequests(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAccepted = async () => {
    try {
      const res = await api.get("/connections"); // returns accepted connections
      setAcceptedConnections(res.data.accepted || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAll = () => {
    fetchPending();
    fetchAccepted();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const respondToRequest = async (requestId, action) => {
    try {
      await api.post(`/connections/${requestId}/respond`, { action });
      alert(`Request ${action}ed`);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to respond");
    }
  };

  return (
    <>
      <style>{`
        body, html, #root {
          height: 100%;
          margin: 0;
        }
        .page-wrapper {
          width: 100vw;
          height: 100vh;
          background: #f1f3f5;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        .connections-container {
          width: 100%;
          max-width: 1000px;
          height: 100%;
          display: grid;
          grid-template-rows: 1fr 1fr;
          gap: 1.5rem;
        }
        .card {
          background: #fff;
          border-radius: 1.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .card-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          font-weight: 600;
          padding: 1rem 1.5rem;
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .card-body {
          overflow-y: auto;
          flex: 1;
        }
        .list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f1f3f5;
          transition: background 0.2s;
        }
        .list-item:hover {
          background: #f8f9fc;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          color: #495057;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .action-btn {
          font-size: 0.9rem;
          padding: 0.4rem 0.8rem;
          border-radius: 0.75rem;
          border: none;
          margin-left: 0.5rem;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-accept {
          background: #4dab5b;
          color: #fff;
        }
        .btn-decline {
          background: #e03131;
          color: #fff;
        }
        .btn-accept:hover,
        .btn-decline:hover {
          opacity: 0.9;
        }
      `}</style>

      <div className="page-wrapper">
        <div className="connections-container">
          {/* Pending Requests */}
          <div className="card">
            <div className="card-header">Pending Requests</div>
            <div className="card-body">
              {pendingRequests.length === 0 && (
                <div className="p-3 text-muted text-center">
                  No pending requests
                </div>
              )}
              {pendingRequests.map((req) => {
                const firstLetter = req.from.email.charAt(0);
                return (
                  <div key={req._id} className="list-item">
                    <div className="user-info">
                      <div className="avatar">{firstLetter}</div>
                      <div>{req.from.email}</div>
                    </div>
                    <div>
                      <button
                        className="action-btn btn-accept"
                        onClick={() => respondToRequest(req._id, "accept")}
                      >
                        Accept
                      </button>
                      <button
                        className="action-btn btn-decline"
                        onClick={() => respondToRequest(req._id, "decline")}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accepted Connections */}
          <div className="card">
            <div className="card-header">Connections</div>
            <div className="card-body">
              {acceptedConnections.length === 0 && (
                <div className="p-3 text-muted text-center">
                  No connections yet
                </div>
              )}
              {acceptedConnections.map((conn) => {
                const firstLetter = conn.user.email.charAt(0);
                return (
                  <div key={conn._id} className="list-item">
                    <div className="user-info">
                      <div className="avatar">{firstLetter}</div>
                      <div>{conn.user.email}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
