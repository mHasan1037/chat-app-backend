import { Response } from "express";
import Conversation from "../models/Conversation";
import { getIO } from "../utils/socket";

export const createOrGetConversation = async (req: any, res: Response) => {
   try{
       const userId = req.user._id;
       const { recipientId } = req.body;

       if(!recipientId){
           return res.status(400).json({ message: "Reciver is required" });
       };

       let conversation = await Conversation.findOne({
         isGroup: false,
         members: { $all: [userId, recipientId] }
       });

         if(!conversation){ 
            conversation = await Conversation.create({
               isGroup: false,
               members: [userId, recipientId]
            });
         };

         const populatedConversation = await Conversation.findById(conversation._id)
             .populate("members", "name email")
             .populate("lastMessage");

         const io = getIO();

         populatedConversation!.members.forEach((member: any) =>{
           io.to(`user:${member._id}`).emit(
             "conversationUpdated",
             populatedConversation
           )
         });

         return res.json(populatedConversation);
   }catch(err: any){
       return res.status(500).json({ message: err.message });
   }
};

export const getConverSations = async (req: any, res: Response) =>{
    try{
        const userId = req.user._id;

        const conversations = await Conversation.find({ members: userId })
        .populate("members", "name email")
        .populate("lastMessage")
        .sort({ updatedAt: -1 });   

        return res.json(conversations);
    }catch(err: any){
        return res.status(500).json({ message: err.message });
    }
};

export const getConverSationById = async (req: any, res: Response) =>{
   const userId = req.user._id;
   const {id} = req.params;

   const conversation = await Conversation.findById(id)
      .populate("members", "_id name email")
      .populate("lastMessage");

   if(!conversation){
      return res.status(404).json({message: "Conversation is not found"})
   };

   if(!conversation.members.some((m: any) => m._id.toString() === userId.toString())){
     return res.status(403).json({message: 'Not allowed'})
   };

   res.json(conversation);
}