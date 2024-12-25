import { Router } from "express";
import { body } from "express-validator";
import { createProject } from "../controllers/project.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = Router();

router.post("/create",
    isAuthenticated,
    body("name").isString().isLength({ min: 3 }).withMessage("Name should be atleast 3 characters"),
    createProject
)

export default router;