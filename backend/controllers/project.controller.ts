import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../schema/user.model";
import createProjectService from "../services/project.service";
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