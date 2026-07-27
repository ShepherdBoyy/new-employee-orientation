import { useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Slide } from './components/SlideItem'

interface Folder {
    id: number
    name: string
}

interface Props {
    folder: Folder
    slides: Slide[]
}

export default function Preview({ folder, slides }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const currentSlide = slides[currentIndex]
    const isFirst = currentIndex === 0
    const isLast = currentIndex === slides.length - 1
    const progress = slides.length ? ((currentIndex + 1) / slides.length) * 100 : 0

    function handleClose() {
        window.history.back()
    }

    if (slides.length === 0) {
        return (
            <>
                <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-zinc-950 text-zinc-400">
                    <p>No slides in this folder yet.</p>
                    <Button variant="outline" onClick={handleClose}>
                        Close preview
                    </Button>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="flex min-h-screen w-full flex-col bg-zinc-950">
                <div className="flex shrink-0 items-center justify-between bg-indigo-600 px-6 py-2.5 text-sm text-white">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Admin Preview</span>
                        <span className="text-indigo-300">—</span>
                        <span className="text-indigo-200">{folder.name}</span>
                    </div>
                    <button
                        onClick={handleClose}
                        className="inline-flex items-center gap-1.5 text-indigo-200 hover:text-white cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                        Close preview
                    </button>
                </div>

                <div className="h-1.5 w-full shrink-0 bg-zinc-800">
                    <div
                        className="h-1.5 bg-indigo-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="shrink-0 pt-4 text-center text-sm text-zinc-400">
                    Slide {currentIndex + 1} of {slides.length}
                </div>

                <div className="flex flex-1 items-center justify-center p-6">
                    {currentSlide.type === 'video' ? (
                        <video
                            key={currentSlide.id}
                            src={currentSlide.file_url}
                            className="max-h-[70vh] max-w-full rounded-2xl shadow-2xl"
                            controls
                            autoPlay
                        />
                    ) : (
                        <img
                            key={currentSlide.id}
                            src={currentSlide.file_url}
                            alt={`Slide ${currentIndex + 1}`}
                            className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl"
                        />
                    )}
                </div>

                <div className="flex shrink-0 items-center justify-between gap-4 px-8 pb-8">
                    <Button
                        variant="secondary"
                        onClick={() => setCurrentIndex(i => i - 1)}
                        disabled={isFirst}
                        className="disabled:opacity-30"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                    </Button>

                    {isLast ? (
                        <Button disabled className="cursor-not-allowed bg-green-700 opacity-60 hover:bg-green-700">
                            Complete Module (disabled in preview)
                        </Button>
                    ) : (
                        <Button variant="secondary" onClick={() => setCurrentIndex(i => i + 1)}>
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
}