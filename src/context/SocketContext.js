import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Get user ID from localStorage
        const user = localStorage.getItem("user");
        const userId = user ? JSON.parse(user)._id : null;

        if (!userId) return;

        const s = io("http://localhost:3000", {
            transports: ["websocket", "polling"],
        });

        s.on("connect", () => {
            console.log("Socket connected", s.id);
            s.emit("register", userId); // register current user
        });

        // Store userId on socket for easy access
        s.userId = userId;
        setSocket(s);

        return () => s.disconnect();
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
