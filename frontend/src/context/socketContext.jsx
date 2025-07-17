import { createContext, useContext, useEffect, useRef, useState } from "react";
import {io} from "socket.io-client"
import { useUserAuthContext } from "./userAuthContext";

const socketContext = createContext();

export const useSocketContext = ()=>{
    return useContext(socketContext)
}

export const SocketContextProvider = ({children})=>{
    const [socket, setSocket] = useState(null)
    const { userAuth } = useUserAuthContext()

    useEffect(()=>{
        if(!userAuth){
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
            return
        }
        const socket = io("/",{
            path: "/socket.io",
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        })

        socket.on("connect_error", (err) => {
            console.error("Socket connect error:", err.message);
        });

        socket.on("reconnect_attempt", (attempt) => {
            console.log(`Reconnect attempt ${attempt}`);
        });
        
        socket.on("reconnect_failed", () => {
            console.error("Reconnection failed after max attempts");
        });

        setSocket(socket)
        
        return ()=>{
            socket.disconnect()
        }
    },[userAuth])
    return <socketContext.Provider value={socket}>{children}</socketContext.Provider>
}