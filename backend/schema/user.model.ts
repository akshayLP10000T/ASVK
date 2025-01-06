import mongoose from "mongoose";
import { UserTypeDocument, UserTypeModel } from "../types/user";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema<UserTypeDocument>({
    username: {
        type: String,
        unique: true,
        trim: true,
        minlength: [3, "Username should be at least of 3 characters"],
        maxlength: [15, "Username cannot be more than 15 characters"],
        lowercase: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        minlength: [6, "Email should be at least of 6 characters"],
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        minlength: [6, "Password should be at least 6 characters"],
        required: true,
        select: false,
    },
});

userSchema.statics.hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
}

userSchema.methods.generateJWT = function (): string {
    if (!this.email) {
        throw new Error("Email is not defined");
    }
    return jwt.sign({ email: this.email }, process.env.JWT_SECRET!, { expiresIn: '3d' });
};

userSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model<UserTypeDocument, UserTypeModel>("User", userSchema);
export default User;