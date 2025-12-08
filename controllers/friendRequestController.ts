import { Response } from "express";
import User from "../models/User";
import FriendRequest from "../models/FriendRequest";

export const sendFriendRequest = async (req: any, res: Response) =>{
    try{
        const fromUserId = req.user._id;
        const { to } = req.body;

        if(fromUserId.toString() === to){
            return res.status(400).json({message: 'You can not send a request to yourSelft'})
        };

        const toUser = await User.findById(to);
        if(!toUser){
            return res.status(404).json({message: 'User not found'});
        };

        if(toUser.friends.includes(fromUserId)){
            return res.status(400).json({message: 'You are already friends.'})
        };

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { from: fromUserId, to},
                { from: to, to: fromUserId}
            ],
            status: 'pending'
        });
        if(existingRequest){
            return res.status(400).json({message: 'Friend request already pending.'});
        };

        const newRequest = await FriendRequest.create({
            from: fromUserId,
            to,
            status: 'pending'
        });

        return res.status(201).json({
            message: 'Friend request sent.',
            request: newRequest
        })
    } catch (err: any){
        return res.status(500).json({message: err.message})
    }
};