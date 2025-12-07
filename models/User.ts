import mongoose, {Document, Schema, Types} from "mongoose";

export interface IUser extends Document{
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    phone?: string;
    friends: Types.ObjectId[]; 
};

const userSchema = new Schema<IUser>(
    {
       name: { type: String, required: true},
       email: { type: String, required: true, unique: true},
       password: { type: String, required: true},
       phone: { type: String },
       friends: [{type: Schema.Types.ObjectId, ref: "User", default: []}]
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);