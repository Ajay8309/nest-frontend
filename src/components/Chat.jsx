import React, { useEffect, useState, useRef } from "react";
import api from "../api";
import { useSocket } from "../context/SocketContext";

export default function Chat({ otherUserId, otherUserName, otherUserAvatar }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socket = useSocket();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser._id;
  const messagesEndRef = useRef(null);

  // Fetch chat history
  useEffect(() => {
    if (otherUserId) {
      api.get(`/messages/${otherUserId}`).then((res) => setMessages(res.data));
    }
  }, [otherUserId]);

  // Listen for incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (msg) => {
      if (
        (msg.from === otherUserId && msg.to === currentUserId) ||
        (msg.to === otherUserId && msg.from === currentUserId)
      ) {
        setMessages((prev) => {
          if (msg.from === currentUserId) {
            const filtered = prev.filter(
              (m) =>
                !(
                  m.isOptimistic &&
                  m.text === msg.text &&
                  m.from === currentUserId
                )
            );
            return [...filtered, msg];
          }
          return [...prev, msg];
        });
      }
    };

    socket.on("message:received", handleMessageReceived);
    return () => socket.off("message:received", handleMessageReceived);
  }, [socket, otherUserId, currentUserId]);

  // Auto-scroll to the bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim() || !socket) return;

    socket.emit("message:send", { toUserId: otherUserId, text });
    setMessages((prev) => [
      ...prev,
      {
        from: currentUserId,
        to: otherUserId,
        text,
        createdAt: new Date(),
        isOptimistic: true,
      },
    ]);
    setText("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <style>{`
        .chat-card {
          border-radius: 1rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          height: 500px;
        }
        .chat-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          font-weight: 600;
          padding: 0.75rem 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .chat-body {
          flex: 1;
          background: #f8f9fc;
          overflow-y: auto;
          padding: 1rem;
        }
        .msg-row {
          display: flex;
          margin-bottom: 0.75rem;
        }
        .msg-row.incoming {
          justify-content: flex-start;
        }
        .msg-row.outgoing {
          justify-content: flex-end;
        }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          overflow: hidden;
          background: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.5rem;
        }
        .bubble {
          padding: 0.6rem 0.9rem;
          border-radius: 1rem;
          font-size: 0.9rem;
          max-width: 70%;
          box-shadow: 0 1px 2px rgba(0,0,0,0.08);
          position: relative;
        }
        .bubble-out {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          border-bottom-right-radius: 0.4rem;
        }
        .bubble-in {
          background: #fff;
          color: #333;
          border: 1px solid #e2e6ea;
          border-bottom-left-radius: 0.4rem;
        }
        .timestamp {
          display: block;
          font-size: 0.7rem;
          color: #adb5bd;
          margin-top: 0.25rem;
        }
        .chat-footer {
          padding: 0.75rem;
          background: #fff;
          border-top: 1px solid #dee2e6;
        }
        .send-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: #fff;
        }
        .send-btn:hover {
          opacity: 0.9;
        }
      `}</style>

      <div className="card chat-card shadow">
        <div className="chat-header">
          <div className="d-flex align-items-center">
            <div className="avatar me-2">
              {otherUserAvatar ? (
                <img
                  src={otherUserAvatar}
                  alt=""
                  className="img-fluid"
                  style={{ width: "36px", height: "36px" }}
                />
              ) : (
                <i className="bi bi-person fs-5 text-secondary"></i>
              )}
            </div>
            <div>
              <div>{otherUserName || "Chat"}</div>
              <small className="text-light opacity-75">Active now</small>
            </div>
          </div>
          <div>
            <i className="bi bi-telephone me-3"></i>
            <i className="bi bi-camera-video me-3"></i>
            <i className="bi bi-three-dots-vertical"></i>
          </div>
        </div>

        <div className="chat-body">
          {messages.length > 0 ? (
            messages.map((m, i) => {
              const isMe = m.from === currentUserId;
              return (
                <div
                  key={m._id || `temp-${i}`}
                  className={`msg-row ${isMe ? "outgoing" : "incoming"}`}
                >
                  {!isMe && (
                    <div className="avatar">
                      {otherUserAvatar ? (
                        <img
                          src={otherUserAvatar}
                          alt=""
                          className="img-fluid"
                          style={{ width: "36px", height: "36px" }}
                        />
                      ) : (
                        <i className="bi bi-person fs-6 text-secondary"></i>
                      )}
                    </div>
                  )}
                  <div className={`bubble ${isMe ? "bubble-out" : "bubble-in"}`}>
                    {m.text}
                    <span className="timestamp">{formatTime(m.createdAt)}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-muted">Start a conversation!</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-footer">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="btn send-btn" onClick={sendMessage}>
              <i className="bi bi-send-fill"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
