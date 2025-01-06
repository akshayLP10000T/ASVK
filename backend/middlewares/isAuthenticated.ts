import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import redisClient from '../services/redis.service';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<any>=>{
    try {

        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({
                message: "Unauthorized User",
            });
        }

        const isBlackListed = await redisClient.get(token);

        if(isBlackListed){
            res.cookie('token', '');
            return res.status(401).json({
                message: "Unauthorized User",
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET!);

        if(!decode){
            return res.status(401).json({
                message: "Unauthorized User",
            });
        }

        req.user = decode;
        next();
        
    } catch (error: any) {
        console.log(error);
    }
}