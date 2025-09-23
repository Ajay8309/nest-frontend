import React, { useEffect, useState } from 'react';
import api from '../api.js';

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/users/jobseekers')
       .then(res => setUsers(res.data))
       .catch(err => console.error(err));
  }, []);

  const sendRequest = async userId => {
    try {
      await api.post('/connections', { to: userId });
      alert('Connection request sent');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to send request');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Jobseekers</h2>
      <ul className="list-group mt-3">
        {users.map((u, i) => (
          <li key={`${u._id}-${i}`} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              {u.name} – {u.user.email}
            </div>
            <button className="btn btn-sm btn-primary" onClick={() => sendRequest(u.user._id)}>
              Connect
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
