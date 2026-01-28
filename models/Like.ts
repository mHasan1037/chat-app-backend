import mongoose, {Schema, Document} from "mongoose";

export interface ILike extends Document{
   user: mongoose.Types.ObjectId;
   post: mongoose.Types.ObjectId;
   createdAt: Date;
};

const LikeSchema = new Schema<ILike>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
        index: true,
    },
}, {timestamps: {createdAt: true, updatedAt: false}});

LikeSchema.index({user: 1, post: 1}, {unique: true});

export default mongoose.model<ILike>("Like", LikeSchema);