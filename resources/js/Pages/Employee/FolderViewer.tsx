import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    ArrowRight,
    ChevronLeft,
    CheckCircle2,
    PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Slide {
    id: number;
    type: "image" | "video";
    file_url: string;
    order: number;
}

interface Folder {
    id: number;
    slug: string;
    name: string;
}

interface Props {
    folder: Folder;
    slides: Slide[];
    isCompleted: boolean;
}

export default function FolderViewer({ folder, slides, isCompleted }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reachedEnd, setReachedEnd] = useState(isCompleted);
    const [completing, setCompleting] = useState(false);

    const currentSlide = slides[currentIndex];
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === slides.length - 1;
    const progress = slides.length
        ? ((currentIndex + 1) / slides.length) * 100
        : 0;

    function goNext() {
        if (isLast) {
            setReachedEnd(true);
            return;
        }
        setCurrentIndex((prev) => prev + 1);
    }

    function goPrev() {
        if (!isFirst) setCurrentIndex((prev) => prev - 1);
    }

    function handleComplete() {
        setCompleting(true);
        router.post(
            `/orientation/folders/${folder.id}/complete`,
            {},
            { onFinish: () => setCompleting(false) },
        );
    }

    if (slides.length === 0) {
        return (
            <>
                <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background text-center">
                    <p className="text-sm text-muted-foreground">
                        This module has no slides yet. Please contact your
                        administrator.
                    </p>
                    <Link href="/orientation/folders">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to modules
                        </Button>
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="flex h-screen w-full flex-col overflow-hidden">
                {/* Top bar */}
                <div className="flex shrink-0 items-center justify-between gap-6 lg:gap-2 lg:justify-between border-b px-4 lg:px-6 py-3">
                    <Link
                        href="/orientation/folders"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Modules
                    </Link>
                    <p className="text-sm font-medium line-clamp-1">
                        {folder.name}
                    </p>
                    <span className=" w-0 lg:w-16" />
                </div>

                {/* Progress bar */}
                <div className="h-1 w-full shrink-0 bg-muted">
                    <div
                        className="h-1 bg-primary transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                {/* Slide media */}
                <div className="flex flex-1 overflow-hidden bg-muted-foreground/10">
                    <div className="hidden w-72 shrink-0 border-r bg-background lg:flex lg:flex-col">
                        {/*      <div className="border-b px-4 py-3 flex items-center justify-between">
                            <h2 className="text-sm font-medium">
                                {folder.name}
                            </h2>
                        </div> */}
                        <div className="flex-1 space-y-3 overflow-y-auto p-4">
                            {slides.map((slide, index) => (
                                <>
                                    <button
                                        key={slide.id}
                                        onClick={() => setCurrentIndex(index)}
                                        className={cn(
                                            "group overflow-hidden rounded-xl border bg-background p-2 transition-all duration-300",
                                            currentIndex === index
                                                ? "border-primary ring-2 ring-primary/20 scale-[1.03] shadow-md"
                                                : "hover:border-primary/40 hover:shadow-md hover:scale-[1.01]",
                                        )}
                                    >
                                        <div className="overflow-hidden rounded-lg border">
                                            {slide.type === "video" ? (
                                                <video src={slide.file_url} />
                                            ) : (
                                                <img
                                                    src={slide.file_url}
                                                    className="aspect-video w-full rounded-lg object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-xs font-medium">
                                                Slide {index + 1}
                                            </span>

                                            {slide.type === "video" && (
                                                <PlayCircle className="h-3.5 w-3.5" />
                                            )}
                                        </div>
                                    </button>
                                </>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col items-center justify-center p-4 lg:p-6">
                        <div className="flex h-full w-full max-w-6xl items-center justify-center rounded-2xl lg:rounded-3xl border bg-background p-3 sm:p-4 lg:p-6 shadow-md ">
                            {currentSlide.type === "video" ? (
                                <video
                                    key={currentSlide.id}
                                    src={currentSlide.file_url}
                                    className="max-h-[55vh] sm:max-h-[60vh] lg:max-h-[65vh] max-w-full rounded-xl object-contain"
                                    controls
                                    autoPlay
                                    onEnded={() =>
                                        isLast && setReachedEnd(true)
                                    }
                                />
                            ) : (
                                <img
                                    key={currentSlide.id}
                                    src={currentSlide.file_url}
                                    alt={`Slide ${currentIndex + 1}`}
                                    className="max-h-[55vh] sm:max-h-[60vh] lg:max-h-[65vh] max-w-full rounded-xl object-contain transition-all duration-300 animate-in fade-in zoom-in-95
"
                                />
                            )}
                        </div>

                        <div className="flex shrink-0 items-center justify-between w-full max-w-7xl mt-6 gap-4">
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
                                        {completing
                                            ? "Completing..."
                                            : "Complete Module"}
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
                    {/* Controls */}
                </div>
            </div>
        </>
    );
}
