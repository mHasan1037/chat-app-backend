import mongoose, { Document, Schema, Types } from "mongoose";

export interface IFriendRequest extends Document {
  _id: Types.ObjectId;
  from: Types.ObjectId;
  to: Types.ObjectId;
  status: "pending" | "accepted" | "declined";
}

const friendRequestSchema = new Schema<IFriendRequest>(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IFriendRequest>(
  "FriendRequest",
  friendRequestSchema
);
