import { Request, Response } from 'express';
import bcrypt from "bcryptjs";
import User from '../models/User';
import generateToken from '../utils/generateToken';

export const registerUser = async (req: Request, res: Response) =>{
    try{
       const { name, email, password } = req.body;

       if(!name || !email || !password){
        return res.status(400).json({ message: "All fields are required"});
       };

       const existingUser = await User.findOne({ email });

       if(existingUser){
        return res.status(400).json({ message: "User already exists"});
       };

       const hashPassword = await bcrypt.hash(password, 10);

       const user = await User.create({
        name,
        email,
        password: hashPassword
       });

       res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
       })

    }catch(error: any){
       res.status(500).json({message: error.message})
    }
}

export const loginUser = async (req: Request, res: Response) =>{
   try{
     const {email, password} = req.body;

     const user = await User.findOne({email});
     if(!user){
      return res.status(400).json({message: "User not found"})
     };

     const isMatch = await bcrypt.compare(password, user.password);
     if(!isMatch){
      return res.status(400).json({message: "Invalid credentials"});
     };

     res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id.toString())
     })
   }catch(error: any){
     res.status(500).json({ message: error.message })
   }
}