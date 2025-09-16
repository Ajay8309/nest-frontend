import React, { useEffect, useState } from "react";
import api from "../api";

export default function MessagesPage() {
  const [toProfileId, setToProfileId] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    if (!toProfileId) return;
    const res = await api.get(`/messages?conversationWith=${toProfileId}`);
    setMessages(res.data.messages);
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [toProfileId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("toProfileId", toProfileId);
    formData.append("text", text);
    await api.post("/messages", formData);
    setText("");
    fetchMessages();
  };

  return (
    <div className="col-md-8 mx-auto">
      <h2>Messages</h2>
      <div className="mb-3">
        <input
          className="form-control"
          placeholder="Conversation with Profile ID"
          value={toProfileId}
          onChange={e=>setToProfileId(e.target.value)}
        />
      </div>
      <form onSubmit={sendMessage} className="mb-3">
        <input
          className="form-control mb-2"
          placeholder="Your message"
          value={text}
          onChange={e=>setText(e.target.value)}
        />
        <button className="btn btn-primary">Send</button>
      </form>
      <ul className="list-group">
        {messages.map(m => (
          <li className="list-group-item" key={m._id}>
            <strong>{m.from?.name || m.from}:</strong> {m.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
