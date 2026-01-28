import {Response} from 'express';
import Like from '../models/Like';
import Post from '../models/Post';

export const toggleLike = async (req: any, res: Response) =>{
    const userId = req.user._id;
    const {postId} = req.params;

    const existingLike = await Like.findOne({user: userId, post: postId});

    if(existingLike){
        await existingLike.deleteOne();
        await Post.findByIdAndUpdate(postId, {$inc: {likeCount: -1}});

        return res.json({liked: false})
    };

    await Like.create({user: userId, post: postId});
    await Post.findByIdAndUpdate(postId, {$inc: {likeCount: 1}});

    res.json({liked: true});
}