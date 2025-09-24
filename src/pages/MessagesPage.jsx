// src/pages/MessagingPage.js
import React, { useState, useEffect } from "react";
import api from "../api";
import Chat from "../components/Chat";

export default function MessagesPage() {
  const [connections, setConnections] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserObj, setSelectedUserObj] = useState(null);

  useEffect(() => {
    api.get("/connections").then((res) => {
      setConnections(res.data.accepted || []);
    });
  }, []);

  const handleSelect = (user) => {
    setSelectedUser(user._id);
    setSelectedUserObj(user);
  };

  return (
    <>
      <style>{`
        .messaging-container {
          height: 100vh;
          display: flex;
          overflow: hidden;
          background: #f8f9fc;
        }
        .connections-list {
          width: 280px;
          border-right: 1px solid #dee2e6;
          background: #fff;
          display: flex;
          flex-direction: column;
        }
        .connections-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          padding: 1rem;
          font-weight: 600;
        }
        .connections-scroll {
          overflow-y: auto;
          flex: 1;
        }
        .connection-item {
          padding: 0.75rem 1rem;
          cursor: pointer;
          border-bottom: 1px solid #f1f3f5;
          display: flex;
          align-items: center;
          transition: background 0.2s;
        }
        .connection-item:hover {
          background: #f8f9fc;
        }
        .connection-item.active {
          background: #e5e7ff;
        }
        .connection-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.75rem;
          flex-shrink: 0;
          color: #495057;
          font-weight: 600;
          font-size: 0.9rem;
          text-transform: uppercase;
        }
        .chat-area {
          flex: 1;
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .placeholder-text {
          color: #adb5bd;
          font-size: 1rem;
        }
      `}</style>

      <div className="messaging-container">
        {/* Connections sidebar */}
        <div className="connections-list">
          <div className="connections-header">Connections</div>
          <div className="connections-scroll">
            {connections.length > 0 ? (
              connections.map((c) => {
                const firstLetter = c.user.email
                  ? c.user.email.charAt(0)
                  : "?";
                return (
                  <div
                    key={c._id}
                    className={`connection-item ${
                      selectedUser === c.user._id ? "active" : ""
                    }`}
                    onClick={() => handleSelect(c.user)}
                  >
                    <div className="connection-avatar">{firstLetter}</div>
                    <div>
                      <div className="fw-semibold">{c.user.email}</div>
                      <small className="text-muted">Click to chat</small>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-muted">No connections yet.</div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="chat-area">
          {selectedUser ? (
            <div style={{ width: "100%", maxWidth: "700px" }}>
              <Chat
                otherUserId={selectedUser}
                otherUserName={selectedUserObj?.email}
                // still pass null for avatar so Chat shows its own default
                otherUserAvatar={null}
              />
            </div>
          ) : (
            <div className="placeholder-text">
              Select a connection to start chatting
            </div>
          )}
        </div>
      </div>
    </>
  );
}
