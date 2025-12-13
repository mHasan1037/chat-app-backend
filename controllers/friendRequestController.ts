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
        });
        if(existingRequest){
            return res.status(400).json({message: 'Friend request already pending.'});
        };

        const newRequest = await FriendRequest.create({
            from: fromUserId,
            to,
        });

        return res.status(201).json({
            message: 'Friend request sent.',
            request: newRequest
        })
    } catch (err: any){
        return res.status(500).json({message: err.message})
    }
};

export const getIncomingRequests = async (req: any, res: Response) =>{
    try{
        const userId = req.user._id;
        const requests = await FriendRequest.find({
            to: userId,
        }).populate('from', 'name email');

        return res.json(requests);
    } catch(err: any){
        return res.status(500).json({message: err.message});
    }
};

export const acceptFriendRequest = async (req: any, res: Response) =>{
    try{
       const requestId = req.params.id;
       const userId = req.user._id;
       const request = await FriendRequest.findById(requestId);
       if(!request) return res.status(404).json({message: "Request not found"});
       if(request.to.toString() !== userId.toString()){
        return res.status(403).json({message: 'Not allowed'})
       };

       const fromUser = await User.findById(request.from);
       const toUser = await User.findById(request.to);

       if(!fromUser || !toUser){
          return res.status(404).json({message: 'User not found'});
       };

       if(!fromUser.friends.includes(toUser._id)){
         fromUser.friends.push(toUser._id)
       };

       if(!toUser.friends.includes(fromUser._id)){
         toUser.friends.push(fromUser._id);
       };

       await fromUser.save();
       await toUser.save();

       await request.deleteOne();

       return res.json({message: 'Friend request accepted'});
    } catch(err: any){
       return res.status(500).json({message: err.message});
    }
}

export const declineFriendRequest = async (req: any, res: Response) =>{
    try{
       const requestId = req.params.id;
       const userId = req.user._id;
       const request = await FriendRequest.findById(requestId);
       if(!request) return res.status(404).json({message: 'Request not found'});
       if(request.to.toString() !== userId.toString()){
         return res.status(403).json({message: 'Not allowed'});
       };
       
       await request.deleteOne();

       return res.json({message: 'Friend request declined'});
    }catch(err: any){
        return res.status(500).json({message: err.message});
    }
};

export const getFriendsList = async (req: any, res: Response) =>{
    try{
        const userId = req.user._id;
        const user = await User.findById(userId).populate(
            'friends',
            'name email'
        );
        return res.json(user?.friends || []);
    }catch(err: any){
        return res.status(500).json({message: err.message});
    }
}

export const cancelFriendRequest = async (req: any, res: Response) =>{
    try{
       const requestId = req.params.id;
       const userId = req.user._id;
       const request = await FriendRequest.findById(requestId);

       if(!request){
        return res.status(404).json({message: 'Request not found'});
       };

       if(request.from.toString() !== userId.toString()){
        return res.status(403).json({message: "Not allowed"})
       };

       await request.deleteOne();

       return res.json({message: 'Friend request cancelled'});
    }catch(err: any){
       return res.status(500).json({message: err.message});
    }
}