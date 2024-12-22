import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller";
import { body } from "express-validator";

const router = Router();

router.post("/register",
    body("email").isEmail().isLength({ min: 6 }).withMessage("Email must be valid and more than 6 characters"),
    body("password").isLength({ min: 6 }).withMessage("Password should be atleast 6 character long"),
    body("username").isLength({ min: 6, max: 15 }).withMessage("Username should be between 6 to 15 characters long"),
    registerUser);

router.post("/login",
    body("email").isEmail().isLength({ min: 6 }).withMessage("Email must be valid and more than 6 characters"),
    body("password").isLength({ min: 6 }).withMessage("Password should be atleast 6 character long"),
    loginUser
)

export default router