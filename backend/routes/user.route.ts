import { Router } from "express";
import { getAllUsers, loginUser, logout, registerUser, userProfile } from "../controllers/user.controller";
import { body } from "express-validator";
import { isAuthenticated } from "../middlewares/isAuthenticated";

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
router.get("/profile", isAuthenticated, userProfile);
router.get("/logout", isAuthenticated, logout);
router.get("/all", isAuthenticated, getAllUsers);

export default router