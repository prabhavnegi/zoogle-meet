import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { roomManager } from "./roomManager";

const roommanager = new roomManager()

export const webSocket = (httpServer: HttpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: "*"
        }
    })

    io.on("connection", (socket)=>{
        console.log("Client connected")
        const id = socket.handshake.query.roomdId
        socket.emit("connected", () => {
            
        })
        handlers(socket)
    
    })
}

function handlers(socket: Socket) {

    socket.on("joinRoom", (data) => {
        const roomId = data.roomdId
    })

    socket.on("createroom", (data) => {
        const roomId = data.roomdId
    })

    socket.on("offer", ({sdp, roomId}: {sdp: string, roomId: string}) => {
        roommanager.onOffer(roomId, sdp, socket.id);
    })

    socket.on("answer",({sdp, roomId}: {sdp: string, roomId: string}) => {
        roommanager.onAnswer(roomId, sdp, socket.id);
    })

}