import { Socket } from "socket.io"

interface room {
    user1 : Socket
    user2? : Socket
}

export class roomManager {

    private rooms : Map<string, room>

    constructor() {
        this.rooms = new Map<string, room>()
    }

    createRoom(user1 : Socket, roomId: string) {
        this.rooms.set(roomId, {user1})
    }

    joinRoom (user2 : Socket, roomId :string) {
        const room = this.rooms.get(roomId)
        const user1 = this.rooms.get(roomId)?.user1
        if(!room || !user1)
            return
        this.rooms.set(roomId, {user1,user2})
    }

    onOffer(roomId: string, sdp: string, senderSocketid: string) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.id === senderSocketid ? room.user2: room.user1;
        receivingUser?.emit("offer", {
            sdp,
            roomId
        })
    }
    
    onAnswer(roomId: string, sdp: string, senderSocketid: string) {
        const room = this.rooms.get(roomId);
        if (!room) {
            return;
        }
        const receivingUser = room.user1.id === senderSocketid ? room.user2: room.user1;

        receivingUser?.emit("answer", {
            sdp,
            roomId
        });
    }



}