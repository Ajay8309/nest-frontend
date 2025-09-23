// src/components/Chat.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useSocket } from '../context/SocketContext';

export default function Chat({ otherUserId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const socket = useSocket();

  useEffect(() => {
    api.get(`/messages/${otherUserId}`).then(res => setMessages(res.data));
  }, [otherUserId]);

  console.log(messages);

  useEffect(() => {
    if (!socket) return;
    socket.on('message:received', msg => {
        console.log("hello");
      if (
        (msg.from === otherUserId && msg.to === socket.userId) ||
        (msg.to === otherUserId && msg.from === socket.userId)
      ) {
        setMessages(prev => [...prev, msg]);
      }
    });
    return () => socket.off('message:received');
  }, [socket, otherUserId]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit('message:send', { toUserId: otherUserId, text });
    setMessages(prev => [...prev, { from: 'me', text }]);
    setText('');
  };

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 overflow-auto mb-3 border rounded p-3 bg-white">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 d-flex ${
              m.from === otherUserId ? 'justify-content-start' : 'justify-content-end'
            }`}
          >
            <span
              className={`p-2 rounded ${
                m.from === otherUserId ? 'bg-light' : 'bg-primary text-white'
              }`}
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
          onChange={e => setText(e.target.value)}
        />
        <button className="btn btn-primary" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}
