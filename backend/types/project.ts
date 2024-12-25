import mongoose from "mongoose";

export interface ProjectType{
    name: string;
    users: mongoose.Schema.Types.ObjectId[];
}