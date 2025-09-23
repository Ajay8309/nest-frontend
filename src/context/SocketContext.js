import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ userId, children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const s = io('http://localhost:3000', { transports: ['websocket', 'polling'] });
    s.on('connect', () => {
      console.log('Socket connected', s.id);
      s.emit('register', userId); // register current user
    });
    setSocket(s);
    return () => s.disconnect();
  }, [userId]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
