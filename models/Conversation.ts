import mongoose, { Document, Schema, Types } from "mongoose";

export interface IConversation extends Document {
    members: Types.ObjectId[];
    lastMessage?: Types.ObjectId;
    isGroup: boolean;
    createdAt: Date;
    updatedAt: Date;
};

const conversationSchema = new Schema<IConversation>(
    {
        members: [
            { type: Schema.Types.ObjectId, ref: "User", required: true }
        ],
        lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
        isGroup: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

export default mongoose.model<IConversation>("Conversation", conversationSchema);