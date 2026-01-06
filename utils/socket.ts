import {Server as IOServer} from "socket.io";
import type {Server as HTTPServer} from "http";

let io: IOServer | null = null;

export const initSocket = (server: HTTPServer) =>{
    io = new IOServer(server, {
        cors: {
            origin: (origin, callback) =>{
                const allowedOrigins = [
                    "https://chat-app-frontend-eight-woad.vercel.app/",
                    process.env.FRONTEND_URL?.replace(/\/$/, "")
                ];

                if(!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))){
                    callback(null, true);
                }else{
                    callback(new Error("Not allowed by CORS"))
                }
            },
            credentials: true,
        }
    });

    io.on("connection", (socket) =>{
        socket.on('joinUser', (userId: string) =>{
           socket.join(`user:${userId}`);
        });

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