// src/pages/MessagingPage.js
import React, { useState, useEffect } from "react";
import api from "../api";
import Chat from "../components/Chat";

export default function MessagesPage() {
    const [connections, setConnections] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        api.get("/connections").then((res) => {
            setConnections(res.data.accepted || []);
        });
    }, []);

    // console.log(selectedUser);
    connections.map((c) => {
      console.log(c);
    })

    return (
        <div className="container-fluid vh-100">
            <div className="row h-100">
                <div className="col-3 border-end p-0 bg-light">
                    <div className="list-group list-group-flush">
                        <div className="list-group-item bg-secondary text-white">
                            <strong>Connections</strong>
                        </div>
                        {connections.map((c) => (
                            <button
                                key={c._id}
                                className={`list-group-item list-group-item-action ${
                                    selectedUser === c.user._id ? "active" : ""
                                }`}
                                onClick={() => setSelectedUser(c.user._id)}
                            >
                                {c.user.email}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat area */}
                <div className="col-9 p-3">
                    {selectedUser ? (
                        <Chat otherUserId={selectedUser} />
                    ) : (
                        <div className="text-muted text-center mt-5">
                            Select a connection to start chatting
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
