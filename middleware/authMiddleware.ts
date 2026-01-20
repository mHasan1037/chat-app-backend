import { NextFunction, Response } from "express";
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const protectedRoute = async (req: any, res: Response, next: NextFunction) =>{
    let token;

    console.log("Authorization header:", req.headers.authorization);

    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
           token = req.headers.authorization.split(' ')[1];

           const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
           console.log("Decoded token:", decoded);

           const user = await User.findById(decoded.id).select('-password');
           console.log("User from DBB:", user);

            if (!user) {
                return res.status(401).json({ message: "User not found" });
            };

            req.user = user;

           return next();
        }catch (error){
           return res.status(401).json({message: "Not authorized, token failed"})
        }
    }

    if(!token){
        return res.status(401).json({message: 'Not authorized, no token'})
    }
}