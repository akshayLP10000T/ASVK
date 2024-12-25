import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../schema/user.model";
import { addUsersToProject, createProjectService, getAllProjectByUserId, getProjectByIdService } from "../services/project.service";
import mongoose from "mongoose";
import Project from "../schema/project.model";

export const createProject = async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const { name } = req.body;
    const loggedInUser = await User.findOne({ email: req.user.email });

    const project = await Project.findOne({ name });
    if (project) {
        return res.status(401).json({
            message: "Soory this name is not available",
        });
    }

    if (!loggedInUser) {
        return res.status(401).json({
            message: "User not found",
        });
    }

    const userId = loggedInUser._id as mongoose.Schema.Types.ObjectId;

    const newProject = await createProjectService({ name, userId });

    return res.status(201).json({
        project: newProject,
        message: "Project created successfully",
    });
}

export const getAllProject = async (req: Request, res: Response): Promise<any> => {
    try {

        const loggedInUser = await User.findOne({ email: req.user.email });

        const allUserProjects = await getAllProjectByUserId(loggedInUser?._id as mongoose.Schema.Types.ObjectId);

        return res.status(200).json({
            projects: allUserProjects,
        });

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const addUserToProject = async (req: Request, res: Response): Promise<any> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    try {

        const { projectId, users } = req.body;
        const loggedInUser = await User.findOne({ email: req.user.email });

        if (!projectId) {
            return res.status(404).json({
                message: "Project Not found",
            });
        }

        if (users.length === 0) {
            return res.status(404).json({
                message: "Please select at least one user",
            });
        }

        const project = await Project.findOne({ _id: projectId, users: loggedInUser });

        if (!project) {
            return res.status(401).json({
                message: "You can't add any user to this project",
            });
        }

        const loggedInUserId = loggedInUser?._id as mongoose.Schema.Types.ObjectId;
        const addedProject = await addUsersToProject({ projectId, users, userId: loggedInUserId })

        return res.status(200).json({
            project: addedProject
        })

    } catch (error: any) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

export const getProjectById = async (req: Request, res: Response): Promise<any> => {
    const { projectId } = req.params;

    try {

        const project = await getProjectByIdService(projectId);

        return res.status(200).json({
            project,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}