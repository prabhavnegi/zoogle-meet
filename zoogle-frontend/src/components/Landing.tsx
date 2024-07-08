import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client"
import { LocalVideo } from "./LocalVideo";
import { Room } from "./Room";

const url = "http://localhost:3001/"

export const Landing = () =>  {

    const [room, setRoom] = useState(false)

    const joinRoom = () => {
        setRoom(true)
    }


    return (
        <div>
            room ? <Room roomId={"bossRoom"}/> : 
            <div>
                <LocalVideo/>
                    <button onClick={joinRoom}>Create Room</button>
                        <div>
                            <input></input>
                            <button>Join Room</button>
                        </div>
            </div>
        </div>
    )
}