import { useState } from "react";
import { Head } from "@inertiajs/react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Slide {
    id: number;
    type: "image" | "video";
    file_url: string;
    order: number;
    topic_id: number;
    topic_slug: string;
    topic_name: string;
}

interface Folder {
    id: number;
    name: string;
}

interface Props {
    folder: Folder;
    slides: Slide[];
    startIndex: number;
}

export default function PreviewFolder({ folder, slides, startIndex }: Props) {
    const [currentIndex, setCurrentIndex] = useState(startIndex);

    const currentSlide = slides[currentIndex];
    const previousSlide = currentIndex > 0 ? slides[currentIndex - 1] : null;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === slides.length - 1;
    const isNewTopic =
        !previousSlide || previousSlide.topic_id !== currentSlide?.topic_id;
    const progress = slides.length
        ? ((currentIndex + 1) / slides.length) * 100
        : 0;

    // Position within the current topic, e.g. "Slide 2 of 4 in Fire Safety"
    const topicSlides = slides.filter(
        (s) => s.topic_id === currentSlide?.topic_id,
    );
    const positionInTopic =
        topicSlides.findIndex((s) => s.id === currentSlide?.id) + 1;

    function handleNext() {
        if (!isLast) setCurrentIndex((prev) => prev + 1);
    }

    function handlePrev() {
        if (!isFirst) setCurrentIndex((prev) => prev - 1);
    }

    function handleClose() {
        window.history.back();
    }

    if (slides.length === 0) {
        return (
            <>
                <Head title={`Preview — ${folder.name}`} />
                <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 text-gray-400">
                    <p>No slides in this folder yet.</p>
                    <Button variant="outline" onClick={handleClose}>
                        Close preview
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={`Preview — ${folder.name}`} />

            <div className="min-h-screen bg-gray-950 flex flex-col">
                {/* Admin preview banner */}
                <div className="bg-indigo-600 text-white text-sm py-2.5 px-4 flex items-center justify-between shrink-0">
                    <span className="text-indigo-200">{folder.name}</span>
                    <button
                        onClick={handleClose}
                        className="text-indigo-200 hover:text-white transition cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-800 h-1.5 shrink-0">
                    <div
                        className="bg-indigo-500 h-1.5 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Topic context */}
                <div className="shrink-0 pt-4 text-center">
                    <Badge variant="secondary" className="mb-1 font-normal">
                        {currentSlide.topic_name}
                    </Badge>
                    <p className="text-xs text-gray-400">
                        {currentIndex + 1} of {slides.length} overall
                    </p>
                </div>

                {/* Slide media */}
                <div className="flex-1 flex items-center justify-center p-6">
                    {currentSlide.type === "video" ? (
                        <video
                            key={currentSlide.id}
                            src={currentSlide.file_url}
                            className="max-h-[65vh] max-w-full rounded-2xl shadow-2xl"
                            controls
                            autoPlay
                        />
                    ) : (
                        <img
                            key={currentSlide.id}
                            src={currentSlide.file_url}
                            alt={`Slide ${currentIndex + 1}`}
                            className="max-h-[65vh] max-w-full rounded-2xl object-contain shadow-2xl"
                        />
                    )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between px-8 pb-8 gap-4 shrink-0">
                    <Button
                        variant="secondary"
                        onClick={handlePrev}
                        disabled={isFirst}
                        className="disabled:opacity-30"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                    </Button>

                    {isLast ? (
                        <Button
                            disabled
                            className="bg-green-700 hover:bg-green-700 opacity-60 cursor-not-allowed"
                        >
                            Complete Module (disabled in preview)
                        </Button>
                    ) : (
                        <Button variant="secondary" onClick={handleNext}>
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
}
