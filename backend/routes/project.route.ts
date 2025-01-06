import { Router } from "express";
import { body } from "express-validator";
import { addUserToProject, createProject, getAllProject, getProjectById } from "../controllers/project.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.post("/create",
    isAuthenticated,
    body("name").isString().isLength({ min: 3 }).withMessage("Name should be atleast 3 characters"),
    createProject
);
router.get("/all", isAuthenticated, getAllProject);
router.put("/add-user",
    isAuthenticated,
    body("projectId").isString().withMessage("Project Id is required"),
    body("users").isArray({ min: 1 }).withMessage("Please select at least one user").bail().custom((users: any) => users.every((user: any) => typeof user === 'string')).withMessage("Invalid user"),
    addUserToProject
);
router.get("/get-project/:projectId", isAuthenticated, getProjectById);

export default router;