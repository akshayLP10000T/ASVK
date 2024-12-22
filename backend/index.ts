import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import UserRoutes from './routes/user.route';

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/users", UserRoutes);

app.get("/", (_: Request, res: Response)=>{
    res.send("Hello World!");
});

export default app;