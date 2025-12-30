import { getIO } from "../utils/socket";
import { Response } from "express";
import Conversation from "../models/Conversation";
import Message from "../models/Message";

export const sendMessage = async (req: any, res: Response) => {
  try {
    const userId = req.user._id;
    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      content,
    });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: Date.now(),
    });

    const updatedConversation = await Conversation.findById(conversationId)
      .populate("members", "name email")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name email" },
      });

    if (!updatedConversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const io = getIO();

    io.to(conversationId).emit("newMessage", message);

    updatedConversation.members.forEach((member: any) => {
      io.to(`user:${member._id}`).emit(
        "conversationUpdated",
        updatedConversation
      );
    });

    return res.status(201).json(message);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMessages = async (req: any, res: Response) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name email")
      .sort({ createdAt: 1 });

    return res.json(messages);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
