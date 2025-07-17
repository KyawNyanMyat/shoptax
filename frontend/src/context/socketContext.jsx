import { createContext, useContext, useEffect, useRef, useState } from "react";
import {io} from "socket.io-client"
import { useUserAuthContext } from "./userAuthContext";
import { useAdminAuthContext } from "./adminAuthContext";

const socketContext = createContext();

export const useSocketContext = ()=>{
    return useContext(socketContext)
}

export const SocketContextProvider = ({children})=>{
    const [socket, setSocket] = useState(null)
    const { userAuth } = useUserAuthContext()
    const { adminAuth} = useAdminAuthContext()

    useEffect(()=>{
        const auth = userAuth || adminAuth;
        if(!auth){
            return
        }
        //change it to / in hosting
        const newSocket = io("/",{
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
    },[userAuth, adminAuth])
    return <socketContext.Provider value={socket}>{children}</socketContext.Provider>
}