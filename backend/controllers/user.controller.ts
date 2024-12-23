import { Request, Response } from "express";
import { createUser } from "../services/user.service";
import { validationResult } from 'express-validator';
import User from "../schema/user.model";
import RedisClient from '../services/redis.service';
import redisClient from "../services/redis.service";

declare global {
    namespace Express {
        interface Request {
            user: any | null;
        }
    }
}

export const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const userExisted = await User.findOne({ email: req.body.email });

            if (userExisted) {
                return res.status(401).json({
                    message: "E-mail already taken",
                });
            }

            const user = await createUser(req.body);

            const token = user.generateJWT();

            res.cookie('token', token);

            return res.status(201).json({
                user,
                token,
            });

        } catch (error: any) {
            return res.status(400).send(error.message);
        }

    } catch (error: any) {
        console.log(error);
    }
}

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        let user = await User.findOne({ email }).select("password email");

        if (!user) {
            return res.status(401).json({
                message: "E-mail or password is incorrect",
            });
        }

        const isPassMatch = await user.isValidPassword(password);

        if (!isPassMatch) {
            return res.status(401).json({
                message: "E-mail or password is incorrect",
            });
        }

        user = await User.findOne({ email });

        const token = user?.generateJWT();

        res.cookie('token', token);

        return res.status(200).json({
            user,
            token
        });

    } catch (error: any) {
        console.log(error);
    }
}

export const userProfile = async (req: Request, res: Response): Promise<any> => {
    try {

        return res.status(200).json({
            user: req.user,
        });

    } catch (error: any) {
        console.log(error);
    }
}

export const logout = async (req: Request, res: Response): Promise<any> => {
    try {

        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        redisClient.set(token, 'logout', 'EX', 3 * 60 * 60 * 24);

        return res.status(202).json({
            message: "Logged out successfully",
        });

    } catch (error: any) {
        console.log(error);
    }
}