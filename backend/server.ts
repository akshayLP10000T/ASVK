import http from 'http';
import app from './index';
import connectDB from './db/connectDB';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Project from './schema/project.model';

declare module "socket.io" {
    interface Socket {
        user?: any;
        project?: any;
        roomId?: string;
    }
}

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PUT'],
        credentials: true,
    },
    transports: ['websocket'],
});
const PORT = process.env.PORT;

io.use(async (socket, next) => {
    try {

        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query.projectId;

        if (!mongoose.Types.ObjectId.isValid(projectId as string)) {
            return next(new Error('Invalid Project ID'));
        }

        if (!token) {
            return next(new Error('Authentication error'));
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET!);

        if (!decode) {
            return next(new Error('Invalid User'));
        }

        socket.user = decode;

        socket.project = await Project.findById(projectId);

        next();

    } catch (error: any) {
        next(error);
    }
});

io.on('connection', (socket) => {
    socket.roomId = socket.project?._id.toString();
    socket.join(socket.roomId!);

    socket.on('project-message', (data) => {
        socket.broadcast.to(socket.roomId!).emit('project-message', data);
    });

    socket.on("disconnect", () => {
        socket.leave(socket.roomId!);
    });
});

server.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});