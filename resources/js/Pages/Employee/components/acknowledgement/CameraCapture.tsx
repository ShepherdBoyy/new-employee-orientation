import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, RotateCcw, Check, X, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    open: boolean;
    onCapture: (dataUrl: string) => void;
    onClose: () => void;
}

export default function CameraCapture({ open, onCapture, onClose }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [captured, setCaptured] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && !captured) {
            startCamera();
        }
        if (!open) {
            setCaptured(null);
            setError(null);
        }
        return () => stopCamera();
    }, [open, captured]);

    async function startCamera() {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch {
            setError("Could not access your camera. Please allow camera permission and try again.");
        }
    }

    function stopCamera() {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
    }

    function handleCapture() {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        // Crop to a centered square so the captured photo matches the
        // circular guide the employee saw on screen.
        const size = Math.min(video.videoWidth, video.videoHeight);
        const offsetX = (video.videoWidth - size) / 2;
        const offsetY = (video.videoHeight - size) / 2;

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Mirror horizontally to match the mirrored preview the user saw
        ctx.translate(size, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, offsetX, offsetY, size, size, 0, 0, size, size);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
        setCaptured(dataUrl);
        stopCamera();
    }

    function handleRetake() {
        setCaptured(null);
    }

    function handleConfirm() {
        if (!captured) return;
        onCapture(captured);
        onClose();
    }

    function handleClose() {
        stopCamera();
        setCaptured(null);
        onClose();
    }

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-100 flex flex-col bg-black">
            {/* Top bar */}
            <div className="flex shrink-0 items-center justify-between px-4 py-3 sm:px-6">
                <p className="text-sm font-medium text-white">
                    {captured ? "Review your photo" : "Position your face in the guide"}
                </p>
                <button
                    onClick={handleClose}
                    className="rounded-full bg-white/10 p-2 text-white/80 transition hover:bg-white/20 hover:text-white"
                    aria-label="Close camera"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Camera / preview area */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden">
                {error ? (
                    <div className="flex flex-col items-center gap-3 px-6 text-center">
                        <VideoOff className="h-8 w-8 text-white/40" />
                        <p className="max-w-xs text-sm text-white/70">{error}</p>
                        <Button variant="secondary" size="sm" onClick={startCamera}>
                            Try Again
                        </Button>
                    </div>
                ) : captured ? (
                    <img
                        src={captured}
                        alt="Captured photo"
                        className="h-full w-full max-w-md object-cover sm:aspect-square sm:h-auto sm:rounded-3xl"
                    />
                ) : (
                    <>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="h-full w-full scale-x-[-1] object-cover"
                        />

                        {/* Face guide overlay */}
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <div className="relative flex h-[70vw] max-h-105 w-[70vw] max-w-105 items-center justify-center sm:h-95 sm:w-95">
                                <svg
                                    viewBox="0 0 300 300"
                                    className="h-full w-full drop-shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]"
                                    style={{ overflow: "visible" }}
                                >
                                    <defs>
                                        <mask id="face-mask">
                                            <rect x="-9999" y="-9999" width="20000" height="20000" fill="white" />
                                            <ellipse cx="150" cy="150" rx="105" ry="135" fill="black" />
                                        </mask>
                                    </defs>
                                    <rect
                                        x="-9999"
                                        y="-9999"
                                        width="20000"
                                        height="20000"
                                        fill="rgba(0,0,0,0.55)"
                                        mask="url(#face-mask)"
                                    />
                                    <ellipse
                                        cx="150"
                                        cy="150"
                                        rx="105"
                                        ry="135"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="3"
                                        strokeDasharray="10 8"
                                        opacity="0.9"
                                    />
                                </svg>
                            </div>
                        </div>

                        <p className="pointer-events-none absolute bottom-28 left-0 right-0 text-center text-xs text-white/70 sm:bottom-32">
                            Align your face within the outline, then tap capture
                        </p>
                    </>
                )}
            </div>

            {/* Controls */}
            <div className="flex shrink-0 items-center justify-center gap-6 px-6 pb-8 pt-4 sm:pb-10">
                {captured ? (
                    <>
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={handleRetake}
                            className="gap-2"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Retake
                        </Button>
                        <Button size="lg" onClick={handleConfirm} className="gap-2 bg-emerald-600 hover:bg-emerald-500">
                            <Check className="h-4 w-4" />
                            Use This Photo
                        </Button>
                    </>
                ) : (
                    !error && (
                        <button
                            onClick={handleCapture}
                            aria-label="Capture photo"
                            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/80 bg-white/20 transition active:scale-95 sm:h-18 sm:w-18"
                        >
                            <span className="h-12 w-12 rounded-full bg-white sm:h-14 sm:w-14" />
                        </button>
                    )
                )}
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </div>,
        document.body
    );
}