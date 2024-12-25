import mongoose from "mongoose";
import { ProjectType } from "../types/project";

const ProjectSchema = new mongoose.Schema<ProjectType>({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: [true, "project name must be unique"],
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ]
});

const Project = mongoose.model<ProjectType>("Project", ProjectSchema);
export default Project;