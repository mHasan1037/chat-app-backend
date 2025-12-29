import mongoose, { Document, Schema, Types } from "mongoose";

export interface IMessage extends Document{
    conversation: Types.ObjectId;
    sender: Types.ObjectId;
    content: string;
    type: "text" | "image" | "video" | "file";
    createdAt: Date;
    updatedAt: Date;
};

const messageSchema = new Schema<IMessage>(
    {
        conversation: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        content: { type: String, required: true },
        type: {
            type: String,
            enum: ["text", "image", "video", "file"],
            default: "text"
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

export default mongoose.model<IMessage>("Message", messageSchema);