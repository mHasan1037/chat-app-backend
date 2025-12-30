import {Server as IOServer} from "socket.io";
import type {Server as HTTPServer} from "http";

let io: IOServer | null = null;

export const initSocket = (server: HTTPServer) =>{
    io = new IOServer(server, {
        cors: {
            origin: (origin, callback) =>{
                const allowedOrigins = [
                    "http://localhost:3000",
                    process.env.FRONTEND_URL
                ];

                if(!origin || allowedOrigins.includes(origin)){
                    callback(null, true);
                }else{
                    callback(new Error("Not allowed by CORS"))
                }
            },
            credentials: true,
        }
    });

    io.on("connection", (socket) =>{
        socket.on("joinConversation", (conversationId: string) => {
            socket.join(conversationId);
        })
    });

    return io;
};

export const getIO = () =>{
    if(!io) throw new Error("Socket.io not initialized");
    return io;
}