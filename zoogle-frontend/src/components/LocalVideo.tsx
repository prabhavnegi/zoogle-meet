import { useEffect, useRef, useState } from "react";

export const LocalVideo = () => {

    const [localAudioTrack, setLocalAudioTrack] = useState<MediaStreamTrack | null>(null);
    const [localVideoTrack, setLocalVideoTrack] = useState<MediaStreamTrack | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const getLocalStream = async () => {
        try { 
            const stream = await window.navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
    
            const audio = stream.getAudioTracks()[0];
            const video = stream.getVideoTracks()[0];
    
            if (videoRef.current) {
                videoRef.current.srcObject = new MediaStream([video]);
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play();
                };
                setLocalAudioTrack(audio);
                setLocalVideoTrack(video);
            }
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    }
    


    useEffect(() => {
        getLocalStream();
        return () => {
            if (localAudioTrack) {
                localAudioTrack.stop();
            }
            if (localVideoTrack) {
                localVideoTrack.stop();
            }
        };
    }, []);

    return (
        <div>
            <video autoPlay ref={videoRef} />
        </div>
    );

}