import mongoose from "mongoose";
import Project from "../schema/project.model";
import { ProjectType } from "../types/project";
import { Response } from "express";

interface CreateProjectData{
    name: string;
    userId: mongoose.Schema.Types.ObjectId;
}

const createProject = async (data: CreateProjectData): Promise<ProjectType>=>{
    if(!data.name){
        throw new Error("Name is required");
    }
    if(!data.userId){
        throw new Error("User is required");
    }
    let project;

    try {
        project = await Project.create({
            name: data.name,
            users: [data.userId],
        });

    } catch (error: any) {
        if(error.code === 11000){
            throw new Error("Project name already exists");
        }
        throw error;
    }

    return project;
}

export default createProject;