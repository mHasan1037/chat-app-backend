import mongoose, { Document, Schema, Types } from "mongoose";

export interface IFriendRequest extends Document {
  _id: Types.ObjectId;
  from: Types.ObjectId;
  to: Types.ObjectId;
  createdAt: Date;
}

const friendRequestSchema = new Schema<IFriendRequest>(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

friendRequestSchema.index({from: 1, to: 1}, {unique: true});

export default mongoose.model<IFriendRequest>(
  "FriendRequest",
  friendRequestSchema
);
