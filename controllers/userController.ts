import { Response } from "express";
import User from "../models/User";
import FriendRequest from "../models/FriendRequest";

export const searchUsers = async (req: any, res: Response) =>{
    try{
       const query = req.query.query?.trim();
       const loggedInUserId = req.user._id.toString();

       if(!query){
        return res.json([])
       };

       const users = await User.find({
        $or: [
            {name: new RegExp(query, 'i')},
            {email: new RegExp(query, 'i')},
            {phone: new RegExp(query, 'i')},
        ],
       }).select('_id name email phone friends').lean();

       const loggedInUser = await User.findById(loggedInUserId).select('friends');
       const friendIds = loggedInUser?.friends.map((id) => id.toString());

       const pending = await FriendRequest.find({
        $or: [
            {from: loggedInUserId},
            {to: loggedInUserId}
        ],
       }).lean();

       const incomingIds: string[] = [];
       const outgoingIds: string[] = [];
       const requestIdMap = new Map<string, string>();

       pending.forEach((req) =>{
        const fromId = req.from.toString();
        const toId = req.to.toString();

        if(toId === loggedInUserId){
          incomingIds.push(fromId);
          requestIdMap.set(fromId, req._id.toString());
        };

        if(fromId === loggedInUserId){
          outgoingIds.push(toId);
          requestIdMap.set(toId, req._id.toString());
        }
       })

       const result = users
         .filter((u) => u._id.toString() !== loggedInUserId)
         .map((u) =>{
            const id = u._id.toString();

            return{
                _id: u._id,
                name: u.name,
                email: u.email,
                isFriend: friendIds?.includes(id),
                isIncomingRequest: incomingIds.includes(id),
                isOutgoingRequest: outgoingIds.includes(id),
                requestId: requestIdMap.get(id) || null,
            }
         });

         return res.json(result);
    }catch (err: any){
        res.status(500).json({message: err.message})
    }
}