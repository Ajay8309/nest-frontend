import React, { useEffect, useState } from "react";
import api from "../api";

const ConnectionPage = () => {
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [newUserId, setNewUserId] = useState("");

  // Fetch all connections
  const fetchConnections = async () => {
    try {
      const res = await api.get("/connections"); // using your api wrapper
      const accepted = res.data.filter(c => c.status === "accepted");
      const pending = res.data.filter(c => c.status === "pending");
      setConnections(accepted);
      setRequests(pending);
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  // Send connection request
  const sendRequest = async () => {
    if (!newUserId) return;
    try {
      await api.post("/connections", { recipientId: newUserId });
      setNewUserId("");
      fetchConnections();
      alert("Connection request sent!");
    } catch (err) {
      console.error("Error sending request:", err);
      alert(err.response?.data?.msg || "Error sending request");
    }
  };

  // Accept a connection request
  const acceptRequest = async (connectionId) => {
    try {
      await api.put(`/connections/${connectionId}/accept`);
      fetchConnections();
    } catch (err) {
      console.error("Error accepting request:", err);
      alert("Error accepting request");
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Connections</h1>

      {/* Send new request */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter User ID to connect"
          value={newUserId}
          onChange={(e) => setNewUserId(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={sendRequest} className="bg-blue-500 text-white p-2 rounded">
          Send Request
        </button>
      </div>

      {/* Incoming Requests */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Pending Requests</h2>
        {requests.length === 0 && <p>No pending requests</p>}
        <ul>
          {requests.map((req) => (
            <li key={req._id} className="flex justify-between items-center mb-2">
              <span>{req.requester?.name || req.requester}</span>
              <button
                onClick={() => acceptRequest(req._id)}
                className="bg-green-500 text-white p-1 rounded"
              >
                Accept
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Accepted Connections */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Connections</h2>
        {connections.length === 0 && <p>You have no connections yet</p>}
        <ul>
          {connections.map((conn) => {
            const user = conn.requester._id === localStorage.getItem("userId") ? conn.recipient : conn.requester;
            return (
              <li key={conn._id} className="border p-2 mb-2 rounded">
                {user.name || user.email}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ConnectionPage;
