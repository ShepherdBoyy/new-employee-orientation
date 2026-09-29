import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import {
    ArrowLeft,
    ArrowRight,
    ChevronLeft,
    CheckCircle2,
    PlayCircle,
    Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Slide {
    id: number;
    type: "image" | "video";
    file_url: string;
    order: number;
    topic_id: number;
    topic_name: string;
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
    const [highestViewedIndex, setHighestViewedIndex] = useState(
        isCompleted ? slides.length - 1 : 0,
    );

    const currentSlide = slides[currentIndex];
    const previousSlide = currentIndex > 0 ? slides[currentIndex - 1] : null;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === slides.length - 1;
    const isNewTopic =
        !previousSlide || previousSlide.topic_id !== currentSlide?.topic_id;
    const progress = slides.length
        ? ((currentIndex + 1) / slides.length) * 100
        : 0;

    function goToIndex(index: number) {
        if (index > highestViewedIndex) return;
        setCurrentIndex(index);
    }

    function goNext() {
        if (isLast) {
            setReachedEnd(true);
            return;
        }
        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);
        setHighestViewedIndex((prev) => Math.max(prev, nextIndex));
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
        );
    }

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden">
            {/* Top bar */}
            <div className="flex shrink-0 items-center justify-between border-b px-4 py-3 lg:px-6">
                <Link
                    href="/orientation/folders"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Modules</span>
                </Link>
            </div>

            <div className="shrink-0 border-b bg-background px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Topic
                        </p>

                        <h1 className="text-sm lg:text-lg font-semibold">
                            {currentSlide.topic_name}
                        </h1>
                    </div>

                    <span className="shrink-0 text-xs text-muted-foreground">
                        {currentIndex + 1}/{slides.length}
                    </span>
                </div>
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
                    <div className="flex-1 space-y-3 overflow-y-auto p-4">
                        {slides.map((slide, index) => {
                            const locked = index > highestViewedIndex;
                            const isNewTopicInList =
                                index === 0 ||
                                slides[index - 1].topic_id !== slide.topic_id;

                            return (
                                <div key={slide.id}>
                                    {isNewTopicInList && (
                                        <p
                                            className={cn(
                                                "mb-2 truncate px-1 text-xs font-semibold uppercase tracking-wide",
                                                index !== 0 && "mt-4",
                                                "text-muted-foreground",
                                            )}
                                        >
                                            {slide.topic_name}
                                        </p>
                                    )}
                                    <button
                                
                                        onClick={() => goToIndex(index)}
                                        disabled={locked}
                                        className={cn(
                                            "group w-full overflow-hidden rounded-xl border bg-background p-2 text-left transition-all duration-300",
                                            currentIndex === index
                                                ? "scale-[1.03] border-primary shadow-md ring-2 ring-primary/20"
                                                : locked
                                                  ? "cursor-not-allowed opacity-40"
                                                  : "hover:scale-[1.01] hover:border-primary/40 hover:shadow-md",
                                        )}
                                    >
                                        <div className="relative overflow-hidden rounded-lg border">
                                            {slide.type === "video" ? (
                                                <video
                                                    src={slide.file_url}
                                                    className="aspect-video w-full object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={slide.file_url}
                                                    className="aspect-video w-full rounded-lg object-cover"
                                                />
                                            )}
                                            {locked && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="text-xs font-medium">
                                                Slide {index + 1}
                                            </span>

                                            {slide.type === "video" &&
                                                !locked && (
                                                    <PlayCircle className="h-3.5 w-3.5" />
                                                )}
                                        </div>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center p-4 lg:p-6">
                    <div className="flex h-full w-full max-w-6xl items-center justify-center rounded-2xl border bg-background p-3 shadow-md sm:p-4 lg:rounded-3xl lg:p-6">
                        {currentSlide.type === "video" ? (
                            <video
                                key={currentSlide.id}
                                src={currentSlide.file_url}
                                className="max-h-[55vh] max-w-full rounded-xl object-contain sm:max-h-[60vh] lg:max-h-[65vh]"
                                controls
                                controlsList="nodownload"
                                autoPlay
                                onEnded={() => isLast && setReachedEnd(true)}
                            />
                        ) : (
                            <img
                                key={currentSlide.id}
                                src={currentSlide.file_url}
                                alt={`Slide ${currentIndex + 1}`}
                                className="max-h-[55vh] max-w-full rounded-xl object-contain transition-all duration-300 animate-in fade-in zoom-in-95 sm:max-h-[60vh] lg:max-h-[65vh]"
                            />
                        )}
                    </div>

                    <div className="mt-6 flex w-full max-w-7xl shrink-0 items-center justify-between gap-4">
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
            </div>
        </div>
    );
}
