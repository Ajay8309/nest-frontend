import React, { useEffect, useState } from "react";
import api from "../api";

export default function ConnectionsPage() {
  const [connections, setConnections] = useState([]);
  const [recipient, setRecipient] = useState("");

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await api.get("/connections");
        setConnections(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConnections();
  }, []);
  

  const sendRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post("/connections", { recipientProfileId: recipient });
      alert("Connection request sent");
    } catch {
      alert("Error sending request");
    }
  };

  return (
    <div className="col-md-8 mx-auto">
      <h2>Connections</h2>
      <form onSubmit={sendRequest} className="mb-4">
        <input
          className="form-control"
          placeholder="Recipient Profile ID"
          value={recipient}
          onChange={e=>setRecipient(e.target.value)}
        />
        <button className="btn btn-primary mt-2">Send Request</button>
      </form>
      <ul className="list-group">
        {connections.map(c => (
          <li className="list-group-item" key={c._id}>
            {c.requester?.name} ↔ {c.recipient?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
