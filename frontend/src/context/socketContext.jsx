import { createContext, useContext, useEffect, useRef, useState } from "react";
import {io} from "socket.io-client"

const socketContext = createContext();

export const useSocketContext = ()=>{
    return useContext(socketContext)
}

export const SocketContextProvider = ({children})=>{
    const [socket, setSocket] = useState(null)

    useEffect(()=>{
        const socket = io("/",{
            path: "/socket.io",
            withCredentials: true
        })

        setSocket(socket)

        return ()=>{
            socket.disconnect()
        }
    },[])
    return <socketContext.Provider value={socket}>{children}</socketContext.Provider>
}