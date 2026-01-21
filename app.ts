import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";

import authRoutes from "./routes/authRoutes";
import friendRequestRoutes from "./routes/friendRequestRoutes";
import userRoutes from "./routes/userRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRequestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

export default app;
