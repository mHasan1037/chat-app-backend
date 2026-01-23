import { Response } from "express";
import Post from "../models/Post";
import User from "../models/User";

export const createPost = async (req: any, res: Response) => {
  try {
    const { content, visibility } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Post content is required" });
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      visibility,
    });

    res.status(201).json(post);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserPosts = async (req: any, res: Response) => {
  try {
    const paramId = req.params.userId;
    const userId = paramId === "me" ? req.user._id : paramId;
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const cursor = req.query.cursor;

    const viewerId = req.user._id;

    const filter: any = {
      author: userId,
      isDeleted: false,
    };

    const isFriend = await User.exists({
      _id: viewerId,
      friends: userId,
    });

    if (userId != viewerId.toString()) {
      filter.visibility = isFriend ? { $in: ["public", "friends"] } : "public";
    }

    if (cursor) filter.createdAt = { $lt: new Date(cursor) };

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .populate("author", "name");

    const hasNextPage = posts.length > limit;
    if (hasNextPage) posts.pop();

    res.json({
      posts,
      nextCursor: posts.length ? posts[posts.length - 1].createdAt : null,
      hasNextPage,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeedPosts = async (req: any, res: Response) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const cursor = req.query.cursor;
    const userId = req.user._id;

    const user = await User.findById(userId).select('friends');
    const friendsIds = user?.friends || [];

    const filter: any = {
      isDeleted: false,
      $or: [
        { visibility: "public" },
        { author: userId },
        { visibility: "friends", author: {$in: friendsIds} },
      ],
    };

    if (cursor) {
      filter.createdAt = { $lt: new Date(cursor as string) };
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .populate("author", "name");

    const hasNextPage = posts.length > limit;
    if (hasNextPage) posts.pop();

    res.json({
      posts,
      nextCursor: posts.length ? posts[posts.length - 1].createdAt : null,
      hasNextPage,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const updatePost = async (req: any, res: Response) => {
  try {
    const { postId } = req.params;
    const { content, visibility } = req.body;

    const post = await Post.findOne({
      _id: postId,
      author: req.user._id,
      isDeleted: false,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (content) {
      post.content = content;
      post.isEdited = true;
    }

    if (visibility) post.visibility = visibility;

    await post.save();

    res.json(post);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req: any, res: Response) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
      author: req.user._id,
      isDeleted: false,
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.isDeleted = true;
    post.deletedAt = new Date();
    await post.save();

    res.json({ message: "Post deleted" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
