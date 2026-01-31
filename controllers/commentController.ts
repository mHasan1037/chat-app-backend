import { Response } from "express";
import Comment from "../models/Comment";
import Post from "../models/Post";

export const createComment = async (req: any, res: Response) => {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      content,
    });

    await Post.findByIdAndUpdate(postId, {
      $inc: { commentCount: 1 },
    });

    res.status(201).json(comment);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getCommentsByPost = async (req: any, res: Response) => {
  try {
    const { postId } = req.params;
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const cursor = req.query.cursor;

    const filter: any = {
      post: postId,
      isDeleted: false,
    };

    if (cursor) {
      filter.createdAt = { $lt: new Date(cursor) };
    }

    const comments = await Comment.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .populate("author", "name");

    const hasNextPage = comments.length > limit;
    if (hasNextPage) comments.pop();

    res.json({
      comments,
      nextCursor: comments.length
        ? comments[comments.length - 1].createdAt
        : null,
      hasNextPage,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
