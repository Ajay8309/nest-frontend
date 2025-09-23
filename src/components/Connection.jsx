import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Connections() {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);

  // Fetch pending requests
  const fetchPending = async () => {
    try {
      const res = await api.get('/connections/pending');
      setPendingRequests(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch accepted connections
  const fetchAccepted = async () => {
    try {
      const res = await api.get('/connections'); // returns accepted connections
      setAcceptedConnections(res.data.accepted || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Combined fetch
  const fetchAll = () => {
    fetchPending();
    fetchAccepted();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Accept or decline a request
  const respondToRequest = async (requestId, action) => {
    try {
      await api.post(`/connections/${requestId}/respond`, { action });
      alert(`Request ${action}ed`);
      fetchAll(); // refresh lists
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to respond');
    }
  };

  console.log(acceptedConnections);

  return (
    <div className="container mt-4">
      <h3>Pending Requests</h3>
      <ul className="list-group mb-4">
        {pendingRequests.length === 0 && <li className="list-group-item text-muted">No pending requests</li>}
        {pendingRequests.map(req => (
          <li key={req._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>{req.from.email}</div>
            <div>
              <button
                className="btn btn-sm btn-success me-2"
                onClick={() => respondToRequest(req._id, 'accept')}
              >
                Accept
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => respondToRequest(req._id, 'decline')}
              >
                Decline
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h3>Connections</h3>
      <ul className="list-group">
        {acceptedConnections.length === 0 && <li className="list-group-item text-muted">No connections yet</li>}
        {acceptedConnections.map(conn => (
          <li key={conn._id} className="list-group-item">
            {conn.user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
