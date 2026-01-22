import mongoose, {Document, Schema} from "mongoose";

export interface IPost extends Document{
    author: mongoose.Types.ObjectId;
    content: string;
    visibility: "public" | "friends" | "private";
    likeCount: number;
    commentCount: number;
    shareCount: number;
    isEdited: boolean;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
};

const PostSchema = new Schema<IPost>(
    {
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
            maxLength: 5000
        },

        visibility: {
            type: String,
            enum: ['public', 'friends', 'private'],
            default: 'friends',
            index: true,
        },

        likeCount: {
            type: Number,
            default: 0,
        },

        commentCount: {
            type: Number,
            default: 0,
        },

        shareCount: {
            type: Number,
            default: 0,
        },

        isEdited: {
            type: Boolean,
            default: false,
        },
        
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        
        deletedAt: {
            type: Date,
            default: null,
        }
    },
    {
        timestamps: true
    },
);

PostSchema.index({author: 1, createdAt: -1});
PostSchema.index({visibility: 1, createdAt: -1});

export default mongoose.model<IPost>("Post", PostSchema);