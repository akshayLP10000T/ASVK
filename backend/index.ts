import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import UserRoutes from './routes/user.route';
import ProjectRoutes from './routes/project.route';
import GeminiRoutes from './routes/gemini.route';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/users", UserRoutes);
app.use("/projects", ProjectRoutes);
app.use("/gemini", GeminiRoutes);

app.get("/", (_: Request, res: Response) => {
    res.send("Hello World!");
});

export default app;