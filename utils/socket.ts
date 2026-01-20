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
        });

        socket.on("call:offer", ({toUserId, fromUserId, conversationId, offer}) =>{
            io?.to(`user:${toUserId}`).emit("call:offer", {
                fromUserId, 
                conversationId,
                offer
            })
        });

        socket.on("call:answer", ({ toUserId, fromUserId, conversationId, answer }) =>{
           io?.to(`user:${toUserId}`).emit("call:answer", {
             fromUserId,
             conversationId,
             answer
           })
        });

        socket.on("call:ice", ({toUserId, fromUserId, conversationId, candidate}) =>{
            io?.to(`user:${toUserId}`).emit("call:ice", {
                fromUserId,
                conversationId,
                candidate
            })
        });

        socket.on("call:end", ({toUserId, fromUserId, conversationId}) =>{
            io?.to(`user:${toUserId}`).emit('call:end', {
                fromUserId,
                conversationId 
            })
        });
    });

    return io;
};

export const getIO = () =>{
    if(!io) throw new Error("Socket.io not initialized");
    return io;
}