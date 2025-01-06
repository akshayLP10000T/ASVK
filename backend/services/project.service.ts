import mongoose from "mongoose";
import Project from "../schema/project.model";
import { ProjectType } from "../types/project";
import { Response } from "express";

interface CreateProjectData {
    name: string;
    userId: mongoose.Schema.Types.ObjectId;
}

interface AddUserToProjectData {
    projectId: mongoose.Schema.Types.ObjectId;
    users: mongoose.Schema.Types.ObjectId[];
    userId: mongoose.Schema.Types.ObjectId;
}

export const createProjectService = async (data: CreateProjectData): Promise<ProjectType> => {
    if (!data.name) {
        throw new Error("Name is required");
    }
    if (!data.userId) {
        throw new Error("User is required");
    }
    let project;

    try {
        project = await Project.create({
            name: data.name,
            users: [data.userId],
        });

    } catch (error: any) {
        if (error.code === 11000) {
            throw new Error("Project name already exists");
        }
        throw error;
    }

    return project;
}

export const getAllProjectByUserId = async (userId: mongoose.Schema.Types.ObjectId) => {
    if (!userId) {
        throw new Error("User Id is required");
    }

    const allUserProject = await Project.find({
        users: userId
    }).populate('users');

    return allUserProject;
}

export const addUsersToProject = async (data: AddUserToProjectData) => {
    if (!data.projectId) {
        throw new Error("ProjectID is required");
    }

    if (!data.users) {
        throw new Error("Users are required");
    }

    if (!data.userId) {
        throw new Error("User not found");
    }

    const updatedProject = await Project.findOneAndUpdate({
        _id: data.projectId,
    }, {
        $addToSet: {
            users: {
                $each: data.users,
            }
        }
    }, {
        new: true,
    });

    return updatedProject;
}

export const getProjectByIdService = async (projectId: string): Promise<any> => {
    if (!projectId) {
        throw new Error("Project Id not found");
    }

    const project = await Project.findById(projectId).populate('users');
    return project;
}