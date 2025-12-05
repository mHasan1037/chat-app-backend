import mongoose, {Document, Schema, Types} from "mongoose";

export interface IUser extends Document{
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    phone?: string;
};

const userSchema = new Schema<IUser>(
    {
       name: { type: String, required: true},
       email: { type: String, required: true, unique: true},
       password: { type: String, required: true},
       phone: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);