import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, Upload, RotateCcw, VideoOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
    onChange: (dataUrl: string | null) => void
}

export default function PhotoCapture({ onChange }: Props) {
    const videoRef  = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const streamRef = useRef<MediaStream | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [mode, setMode] = useState<'camera' | 'upload'>('camera')
    const [cameraError, setCameraError] = useState<string | null>(null)
    const [captured, setCaptured] = useState<string | null>(null)

    useEffect(() => {
        if (mode === 'camera' && !captured) {
            startCamera()
        }
        return () => stopCamera()
    }, [mode, captured])

    async function startCamera() {
        setCameraError(null)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 },
            })
            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
            }
        } catch {
            setCameraError('Could not access your camera. You can upload a photo instead.')
        }
    }

    function stopCamera() {
        streamRef.current?.getTracks().forEach(track => track.stop())
        streamRef.current = null
    }

    function handleCapture() {
        const video  = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) return

        canvas.width  = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
        setCaptured(dataUrl)
        onChange(dataUrl)
        stopCamera()
    }

    function handleRetake() {
        setCaptured(null)
        onChange(null)
    }

    function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = () => {
            const dataUrl = reader.result as string
            setCaptured(dataUrl)
            onChange(dataUrl)
        }
        reader.readAsDataURL(file)
        e.target.value = ''
    }

    function switchToUpload() {
        stopCamera()
        setMode('upload')
        setCaptured(null)
        onChange(null)
    }

    function switchToCamera() {
        setMode('camera')
        setCaptured(null)
        onChange(null)
    }

    return (
        <div className="space-y-3">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-muted-foreground/25 bg-linear-to-br from-muted/30 to-muted/10">
                {captured ? (
                    <img src={captured} alt="Captured" className="h-full w-full object-cover" />
                ) : mode === 'camera' ? (
                    cameraError ? (
                        <div className="flex flex-col items-center gap-2 px-6 text-center">
                            <VideoOff className="h-6 w-6 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">{cameraError}</p>
                        </div>
                    ) : (
                        <>
                            <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                            {/* Face guide overlay */}
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div className="h-[62%] w-[38%] rounded-[50%] border-2 border-white/50" />
                            </div>
                        </>
                    )
                ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                        <Upload className="h-6 w-6 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">Choose a photo from your device</p>
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
            />

            <div className="flex items-center justify-between">
                {captured ? (
                    <Button type="button" variant="outline" size="sm" onClick={handleRetake}>
                        <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                        Retake
                    </Button>
                ) : mode === 'camera' ? (
                    <Button
                        type="button"
                        size="sm"
                        onClick={handleCapture}
                        disabled={!!cameraError}
                        className={cn(
                            'gap-1.5 rounded-full pl-3 pr-4',
                        )}
                    >
                        <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary-foreground">
                            <Camera className="h-2.5 w-2.5" />
                        </span>
                        Capture Photo
                    </Button>
                ) : (
                    <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="mr-1.5 h-3.5 w-3.5" />
                        Choose File
                    </Button>
                )}

                {!captured && (
                    <button
                        type="button"
                        onClick={mode === 'camera' ? switchToUpload : switchToCamera}
                        className="text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
                    >
                        {mode === 'camera' ? 'Upload instead' : 'Use camera instead'}
                    </button>
                )}
            </div>
        </div>
    )
}