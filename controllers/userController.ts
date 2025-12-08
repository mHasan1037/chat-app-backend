import { Response } from "express";
import User from "../models/User";
import FriendRequest from "../models/FriendRequest";

export const searchUsers = async (req: any, res: Response) =>{
    try{
       const query = req.query.query?.trim();
       const loggedInUserId = req.user._id;

       if(!query){
        return res.json([])
       };

       const users = await User.find({
        $or: [
            {name: new RegExp(query, 'i')},
            {email: new RegExp(query, 'i')},
            {phone: new RegExp(query, 'i')},
        ],
       }).select('_id name email phone friends');

       let filtered = users.filter((u) => u._id.toString() !== loggedInUserId.toString());
       filtered = filtered.filter(
        (u) => !u.friends.includes(loggedInUserId)
       );

       const pending = await FriendRequest.find({
        $or: [
            {from: loggedInUserId},
            {to: loggedInUserId}
        ],
        status: 'pending'
       });

       const involvedIds = pending.flatMap((r) => [
        r.from.toString(),
        r.to.toString()
       ]);

       filtered = filtered.filter(
        (u) => !involvedIds.includes(u._id.toString())
       )

       return res.json(filtered);
    }catch (err: any){
        res.status(500).json({message: err.message})
    }
}