import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from "./routes/authRoutes";
import friendRequestRoutes from "./routes/friendRequestRoutes";
import userRoutes from "./routes/userRoutes";
import chatRoutes from './routes/chatRoutes';
import messageRoutes from './routes/messageRoutes';


dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRequestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes)

app.listen(PORT, ()=>{
    console.log('Server is running well')
})


