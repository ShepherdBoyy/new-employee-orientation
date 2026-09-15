import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RotateCcw, Check, X, VideoOff } from "lucide-react";
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
                video: {
                    facingMode: "user",
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch {
            setError(
                "Could not access your camera. Please allow camera permission and try again.",
            );
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

        const size = Math.min(video.videoWidth, video.videoHeight);
        const offsetX = (video.videoWidth - size) / 2;
        const offsetY = (video.videoHeight - size) / 2;

        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

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
            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-linear-to-b from-black/60 to-transparent px-4 py-3.5 sm:px-6">
                <p className="text-sm font-medium tracking-tight text-white">
                    {captured
                        ? "Review your photo"
                        : "Position your face in the guide"}
                </p>
                <button
                    onClick={handleClose}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-md transition hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    aria-label="Close camera"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black p-4 pt-16 pb-4">
                {error ? (
                    <div className="flex flex-col items-center gap-3 px-6 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                            <VideoOff className="h-5 w-5 text-white/40" />
                        </div>
                        <p className="max-w-xs text-sm leading-relaxed text-white/60">
                            {error}
                        </p>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={startCamera}
                            className="mt-1 rounded-full bg-white/10 text-white hover:bg-white/20"
                        >
                            Try again
                        </Button>
                    </div>
                ) : (
                    <div className="relative aspect-square w-full max-w-[min(88vw,62vh,480px)] overflow-hidden rounded-[2rem] bg-zinc-900 shadow-2xl">
                        {captured ? (
                            <img
                                src={captured}
                                alt="Captured photo"
                                className="h-full w-full object-cover"
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

                                {/* Face guide overlay — aligned to the exact same square box */}
                                <div className="pointer-events-none absolute inset-0">
                                    <svg
                                        viewBox="0 0 300 300"
                                        className="h-full w-full"
                                        style={{ overflow: "visible" }}
                                    >
                                        <defs>
                                            <mask id="face-mask">
                                                <rect
                                                    x="0"
                                                    y="0"
                                                    width="300"
                                                    height="300"
                                                    fill="white"
                                                />
                                                <ellipse
                                                    cx="150"
                                                    cy="145"
                                                    rx="100"
                                                    ry="128"
                                                    fill="black"
                                                />
                                            </mask>
                                        </defs>
                                        <rect
                                            x="0"
                                            y="0"
                                            width="300"
                                            height="300"
                                            fill="rgba(0,0,0,0.55)"
                                            mask="url(#face-mask)"
                                        />
                                        <ellipse
                                            cx="150"
                                            cy="145"
                                            rx="100"
                                            ry="128"
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="3"
                                            strokeDasharray="10 8"
                                            opacity="0.9"
                                        />
                                    </svg>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {!captured && !error && (
                    <p className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-xs text-white/70">
                        Align your face within the outline, then tap capture
                    </p>
                )}
            </div>

            {/* Controls */}
            <div className="relative z-10 flex shrink-0 items-center justify-center gap-4 bg-linear-to-t from-black via-black/95 to-transparent px-6 pb-8 pt-6 sm:pb-10">
                {captured ? (
                    <>
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={handleRetake}
                            className="gap-2 rounded-full bg-white/10 text-white hover:bg-white/20"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Retake
                        </Button>
                        <Button
                            size="lg"
                            onClick={handleConfirm}
                            className="gap-2 rounded-full bg-emerald-600 shadow-lg shadow-emerald-950/40 hover:bg-emerald-500"
                        >
                            <Check className="h-4 w-4" />
                            Use this photo
                        </Button>
                    </>
                ) : (
                    !error && (
                        <button
                            onClick={handleCapture}
                            aria-label="Capture photo"
                            className="group flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/80 bg-white/10 backdrop-blur transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                        >
                            <span className="h-12 w-12 rounded-full bg-white transition group-hover:scale-95" />
                        </button>
                    )
                )}
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </div>,
        document.body,
    );
}