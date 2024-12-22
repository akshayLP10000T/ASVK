import mongoose, { Model } from "mongoose";

interface UserType {
    username: string;
    email: string;
    password: string;
}

export interface UserTypeDocument extends mongoose.Document, UserType {
    generateJWT: () => string;
    isValidPassword: (password: string) => Promise<boolean>;
}

export interface UserTypeModel extends Model<UserTypeDocument>{
    hashPassword: (password: string) => Promise<string>;
}