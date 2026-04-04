import express from 'express';
import cors from 'cors';
import connectDB from './config/db';

import authRoutes from "./routes/authRoutes";
import friendRequestRoutes from "./routes/friendRequestRoutes";
import userRoutes from "./routes/userRoutes";
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';
import postRoutes from './routes/postRoutes';
import likeRoutes from './routes/likeRoutes';
import commentRoutes from './routes/commentRoutes';





const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());
app.use(express.urlencoded({extended: true}));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRequestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);

export default app;

