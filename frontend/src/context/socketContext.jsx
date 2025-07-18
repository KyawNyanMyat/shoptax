import { createContext, useContext, useEffect, useRef, useState } from "react";
import {io} from "socket.io-client"

const socketContext = createContext();

export const useSocketContext = ()=>{
    return useContext(socketContext)
}

export const SocketContextProvider = ({children})=>{
    const [socket, setSocket] = useState(null)

    const backendURL = import.meta.env.VITE_BACKEND_URL || (window.location.hostname === "localhost" ? "http://localhost:5000" : import.meta.env.VITE_BACKEND_URL);


    useEffect(()=>{

        const newSocket = io(backendURL,{
            path: "/socket.io",
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        })

        newSocket.on("connect_error", (err) => {
            console.error("Socket connect error:", err.message);
        });

        newSocket.on("reconnect_attempt", (attempt) => {
            console.log(`Reconnect attempt ${attempt}`);
        });
        
        newSocket.on("reconnect_failed", () => {
            console.error("Reconnection failed after max attempts");
        });

        setSocket(newSocket)
        
        return ()=>{
            newSocket.disconnect()
        }
    },[])
    return <socketContext.Provider value={socket}>{children}</socketContext.Provider>
}