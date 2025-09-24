import React, { useEffect, useState } from "react";
import api from "../api.js";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get("/users/jobseekers")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  const sendRequest = async (userId) => {
    try {
      await api.post("/connections", { to: userId });
      alert("Connection request sent");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to send request");
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
        .userlist-container {
          width: 100%;
          max-width: 1000px;
          height: 100%;
          background: #fff;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
        }
        .userlist-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          font-weight: 600;
          padding: 1.25rem;
          font-size: 1.4rem;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .userlist-body {
          overflow-y: auto;
          flex: 1;
          padding-bottom: 1rem;
        }
        .userlist-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #f1f3f5;
          transition: background 0.2s;
        }
        .userlist-item:hover {
          background: #f8f9fc;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-avatar {
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
        .user-name {
          font-size: 1rem;
          font-weight: 600;
          margin: 0;
        }
        .user-email {
          font-size: 0.85rem;
          color: #6c757d;
        }
        .connect-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: #fff;
          padding: 0.5rem 1rem;
          border-radius: 0.75rem;
          font-size: 0.9rem;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        .connect-btn:hover {
          opacity: 0.9;
        }
      `}</style>

      <div className="page-wrapper">
        <div className="userlist-container">
          <div className="userlist-header">
            <span>Jobseekers</span>
          </div>
          <div className="userlist-body">
            {users.length > 0 ? (
              users.map((u, i) => {
                const firstLetter = u.name
                  ? u.name.charAt(0)
                  : u.user.email.charAt(0);
                return (
                  <div key={`${u._id}-${i}`} className="userlist-item">
                    <div className="user-info">
                      <div className="user-avatar">{firstLetter}</div>
                      <div>
                        <p className="user-name">{u.name}</p>
                        <small className="user-email">{u.user.email}</small>
                      </div>
                    </div>
                    <button
                      className="connect-btn"
                      onClick={() => sendRequest(u.user._id)}
                    >
                      Connect
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="p-3 text-muted text-center">
                No jobseekers found.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
