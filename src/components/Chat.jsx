// src/components/Chat.js
import React, { useEffect, useState } from "react";
import api from "../api";
import { useSocket } from "../context/SocketContext";

export default function Chat({ otherUserId }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const socket = useSocket();

    // Get current user ID from localStorage
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const currentUserId = currentUser._id;

    useEffect(() => {
        if (otherUserId) {
            api.get(`/messages/${otherUserId}`).then((res) =>
                setMessages(res.data)
            );
        }
    }, [otherUserId]);

    console.log(messages);

    useEffect(() => {
        if (!socket) return;

        const handleMessageReceived = (msg) => {
            console.log("Message received:", msg);
            // Check if message is part of this conversation
            if (
                (msg.from === otherUserId && msg.to === currentUserId) ||
                (msg.to === otherUserId && msg.from === currentUserId)
            ) {
                setMessages((prev) => {
                    // If this is our own message, replace the optimistic one
                    if (msg.from === currentUserId) {
                        // Remove any optimistic message with same text and replace with real one
                        const filteredMessages = prev.filter(
                            (m) =>
                                !(
                                    m.isOptimistic &&
                                    m.text === msg.text &&
                                    m.from === currentUserId
                                )
                        );
                        return [...filteredMessages, msg];
                    } else {
                        // For received messages, just add normally
                        return [...prev, msg];
                    }
                });
            }
        };

        socket.on("message:received", handleMessageReceived);
        return () => socket.off("message:received", handleMessageReceived);
    }, [socket, otherUserId, currentUserId]);

    const sendMessage = () => {
        if (!text.trim() || !socket) return;

        socket.emit("message:send", { toUserId: otherUserId, text });

        // Add message to local state immediately (optimistic update)
        const tempMessage = {
            from: currentUserId,
            to: otherUserId,
            text,
            createdAt: new Date(),
            isOptimistic: true, // Mark as optimistic update
        };
        setMessages((prev) => [...prev, tempMessage]);
        setText("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

    return (
        <div className="d-flex flex-column h-100">
            <div
                className="flex-grow-1 overflow-auto mb-3 border rounded p-3 bg-white"
                style={{ height: "400px" }}
            >
                {messages.map((m, i) => (
                    <div
                        key={m._id || `temp-${i}`}
                        className={`mb-2 d-flex ${
                            m.from === currentUserId
                                ? "justify-content-end"
                                : "justify-content-start"
                        }`}
                    >
                        <span
                            className={`p-2 rounded ${
                                m.from === currentUserId
                                    ? "bg-primary text-white"
                                    : "bg-light"
                            }`}
                            style={{ maxWidth: "70%" }}
                        >
                            {m.text}
                        </span>
                    </div>
                ))}
            </div>

            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button className="btn btn-primary" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}
