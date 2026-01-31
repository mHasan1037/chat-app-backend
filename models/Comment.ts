import mongoose, {Schema, Document} from "mongoose";

export interface IComment extends Document{
   post: mongoose.Types.ObjectId;
   author: mongoose.Types.ObjectId;
   content: string;
   isDeleted: boolean;
   createdAt: Date
};

const CommentSchema = new Schema<IComment>({
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true,
        index: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 2000
    },
    isDeleted: {
        type: Boolean,
        default: false,
        index: true,
    },
}, {timestamps: true});

CommentSchema.index({post: 1, createdAt: -1});

export default mongoose.model<IComment>("Comment", CommentSchema);