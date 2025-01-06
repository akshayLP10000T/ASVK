import socket from 'socket.io-client';

let socketInstance: any = null;

export const initializeSocket = (projectId: string)=>{
    socketInstance = socket(import.meta.env.VITE_API_URL, {
        auth: {
            token: localStorage.getItem('token')
        },
        withCredentials: true,
        transports: ['websocket'],
        query: {
            projectId,
        },
    });

    return socketInstance;
}

export const receiveMessage = (eventName: string, cb: CallableFunction)=>{
    socketInstance.on(eventName, cb);
}

export const sendMessage = (eventName: string, data: any)=>{
    socketInstance.emit(eventName, data);
}