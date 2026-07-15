import { useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { ArrowLeft, ArrowRight, ChevronLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Slide {
    id: number
    type: 'image' | 'video'
    file_url: string
    order: number
}

interface Folder {
    id: number
    slug: string
    name: string
}

interface Props {
    folder: Folder
    slides: Slide[]
    isCompleted: boolean
}

export default function FolderViewer({ folder, slides, isCompleted }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [reachedEnd, setReachedEnd] = useState(isCompleted)
    const [completing, setCompleting] = useState(false)

    const currentSlide = slides[currentIndex]
    const isFirst = currentIndex === 0
    const isLast = currentIndex === slides.length - 1
    const progress = slides.length ? ((currentIndex + 1) / slides.length) * 100 : 0

    function goNext() {
        if (isLast) {
            setReachedEnd(true)
            return
        }
        setCurrentIndex(prev => prev + 1)
    }

    function goPrev() {
        if (!isFirst) setCurrentIndex(prev => prev - 1)
    }

    function handleComplete() {
        setCompleting(true)
        router.post(
            `/orientation/folders/${folder.id}/complete`,
            {},
            { onFinish: () => setCompleting(false) }
        )
    }

    if (slides.length === 0) {
        return (
            <>
                <Head title={folder.name} />
                <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background text-center">
                    <p className="text-sm text-muted-foreground">
                        This module has no slides yet. Please contact your administrator.
                    </p>
                    <Link href="/orientation/folders">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to modules
                        </Button>
                    </Link>
                </div>
            </>
        )
    }

    return (
        <>
            <Head title={folder.name} />

            <div className="flex min-h-screen w-full flex-col bg-background">
                {/* Top bar */}
                <div className="flex shrink-0 items-center justify-between border-b px-6 py-3">
                    <Link
                        href="/orientation/folders"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Modules
                    </Link>
                    <p className="text-sm font-medium">{folder.name}</p>
                    <span className="w-16" />
                </div>

                {/* Progress bar */}
                <div className="h-1 w-full shrink-0 bg-muted">
                    <div
                        className="h-1 bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="shrink-0 pt-4 text-center text-sm text-muted-foreground">
                    Slide {currentIndex + 1} of {slides.length}
                </div>

                {/* Slide media */}
                <div className="flex flex-1 items-center justify-center p-6">
                    {currentSlide.type === 'video' ? (
                        <video
                            key={currentSlide.id}
                            src={currentSlide.file_url}
                            className="max-h-[65vh] max-w-full rounded-2xl shadow-lg"
                            controls
                            autoPlay
                            onEnded={() => isLast && setReachedEnd(true)}
                        />
                    ) : (
                        <img
                            key={currentSlide.id}
                            src={currentSlide.file_url}
                            alt={`Slide ${currentIndex + 1}`}
                            className="max-h-[65vh] max-w-full rounded-2xl object-contain shadow-lg"
                        />
                    )}
                </div>

                {/* Controls */}
                <div className="flex shrink-0 items-center justify-between gap-4 px-8 pb-8">
                    <Button
                        variant="outline"
                        onClick={goPrev}
                        disabled={isFirst}
                        className="disabled:opacity-30"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                    </Button>

                    {isLast ? (
                        reachedEnd ? (
                            <Button
                                onClick={handleComplete}
                                disabled={completing}
                                className="bg-emerald-600 hover:bg-emerald-500"
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                {completing ? 'Completing...' : 'Complete Module'}
                            </Button>
                        ) : (
                            <Button onClick={goNext}>
                                Finish Viewing
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        )
                    ) : (
                        <Button variant="outline" onClick={goNext}>
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        </>
    )
}