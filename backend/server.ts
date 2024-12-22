import http from 'http';
import app from './index';
import connectDB from './db/connectDB';

const server = http.createServer(app);
const PORT = process.env.PORT;

server.listen(PORT, async ()=>{
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
});