import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client";

const url = "http://localhost:3001/"


export const Room = ({roomId}: {roomId:string}) => {

    const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
    const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(null);
    const [remoteVideoTrack, setRemoteVideoTrack] = useState<MediaStreamTrack | null>(null);
    const [remoteAudioTrack, setRemoteAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [remoteMediaStream, setRemoteMediaStream] = useState<MediaStream | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>();
    const localVideoRef = useRef<HTMLVideoElement>();
    const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);

    const getLocalTrack = async () => {
        try { 
            const stream = await window.navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
    
            const audio = stream.getAudioTracks()[0];
            const video = stream.getVideoTracks()[0];
    
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = new MediaStream([video]);
                localVideoRef.current.onloadedmetadata = () => {
                    localVideoRef.current?.play();
                };
                setLocalAudioTrack(audio);
                setLocalVideoTrack(video);
            }
        } catch (error) {
            console.error("Error accessing local media devices:", error);
        }
    }

    useEffect(() => {
        const socket = io(url, { query: {roomId} })

        socket.on("send offer", ({roomId}) => {
            console.log("sending offer")
            const peer = new RTCPeerConnection()
            setSendingPc(peer)
            getLocalTrack()
            if (localVideoTrack) {
                console.error("added tack");
                // console.log(localVideoTrack)
                peer.addTrack(localVideoTrack)
            }
            if (localAudioTrack) {
                console.error("added tack");
                // console.log(localAudioTrack)
                peer.addTrack(localAudioTrack)
            }

            peer.onicecandidate = async (e) => {
                console.log("receiving ice candidate locally");
                if (e.candidate) {
                        socket.emit("add-ice-candidate", {
                        candidate: e.candidate,
                        type: "sender",
                        roomId
                    })
                }
            }

            peer.onnegotiationneeded = async () => {
                console.log("on negotiation neeeded, sending offer");
                const sdp = await peer.createOffer();
                peer.setLocalDescription(sdp);
                socket.emit("offer", {
                    sdp,
                    roomId
                })
            }
            
        })

        socket.on("offer", async ({roomId, remotesdp}) => {
            console.log("received offer")
            const peer = new RTCPeerConnection()
            peer.setRemoteDescription(remotesdp)
            const sdp = await peer.createAnswer()
            peer.setLocalDescription(sdp);

            const stream = new MediaStream();
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }

            setRemoteMediaStream(stream)
            setReceivingPc(peer);

            peer.onicecandidate = async (e) => {
                if (!e.candidate) {
                    return;
                }
                console.log("on ice candidate on receiving side");
                if (e.candidate) {
                        socket.emit("add-ice-candidate", {
                        candidate: e.candidate,
                        type: "receiver",
                        roomId
                    })
                }
            }

            socket.emit("answer", {
                roomId,
                sdp: sdp
            })

        })
    },[])

    return (
        <div>

        </div>
    )
}