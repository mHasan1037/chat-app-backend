import { Response } from "express";
import getProvider from "../utils/providerFactory";

const createConversationWithAi = async (req: any, res: Response) =>{
  try{
    const {messages} = req.body;

    const provider = getProvider();
    const reply = await provider(messages);

    res.json({reply});
  }catch(err){
    console.error(err);
    res.status(500).json({err: "AI failed"})
  }
};

export default createConversationWithAi;