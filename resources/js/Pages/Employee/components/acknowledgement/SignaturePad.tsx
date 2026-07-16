import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Eraser, PenLine } from 'lucide-react'

interface Props {
    onChange: (dataUrl: string | null) => void
}

export default function SignaturePad({ onChange }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const drawing = useRef(false)
    const [isEmpty, setIsEmpty] = useState(true)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ratio = window.devicePixelRatio || 1
        canvas.width = canvas.offsetWidth * ratio
        canvas.height = canvas.offsetHeight * ratio

        const ctx = canvas.getContext('2d')
        if (ctx) {
            ctx.scale(ratio, ratio)
            ctx.lineWidth = 2.5
            ctx.lineCap = 'round'
            ctx.lineJoin = 'round'
            ctx.strokeStyle = '#18181b'
        }
    }, [])

    function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
        const rect = canvasRef.current!.getBoundingClientRect()
        return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
        drawing.current = true
        const ctx = canvasRef.current!.getContext('2d')!
        const { x, y } = getPos(e)
        ctx.beginPath()
        ctx.moveTo(x, y)
    }

    function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
        if (!drawing.current) return
        const ctx = canvasRef.current!.getContext('2d')!
        const { x, y } = getPos(e)
        ctx.lineTo(x, y)
        ctx.stroke()
        if (isEmpty) setIsEmpty(false)
    }

    function handlePointerUp() {
        if (!drawing.current) return
        drawing.current = false
        emitValue()
    }

    function emitValue() {
        const canvas = canvasRef.current
        if (!canvas) return
        onChange(isEmpty ? null : canvas.toDataURL('image/png'))
    }

    function handleClear() {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext('2d')
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
        setIsEmpty(true)
        onChange(null)
    }

    return (
        <div className="space-y-2.5">
            <div
                className={
                    'relative overflow-hidden rounded-2xl border-2 border-dashed bg-linear-to-br from-muted/30 to-muted/10 transition-colors ' +
                    (isEmpty ? 'border-muted-foreground/25' : 'border-primary/30')
                }
            >
                <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    className="h-40 w-full touch-none sm:h-48"
                />

                {/* Signature baseline */}
                <div className="pointer-events-none absolute inset-x-8 bottom-8 border-b border-dashed border-muted-foreground/20 sm:bottom-10" />

                {isEmpty && (
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-muted-foreground/50">
                        <PenLine className="h-4 w-4" />
                        <p className="text-sm">Sign here</p>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between">
                <p className="text-[11px] text-muted-foreground">
                    Use your finger, stylus, or mouse
                </p>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    disabled={isEmpty}
                    className="text-muted-foreground hover:text-destructive"
                >
                    <Eraser className="mr-1.5 h-3.5 w-3.5" />
                    Clear
                </Button>
            </div>
        </div>
    )
}