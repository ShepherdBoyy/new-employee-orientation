import { useState } from 'react'
import { router } from '@inertiajs/react'
import SlideCard from './SlideCard'

export interface Slide {
    id: number
    folder_id: number
    type: 'image' | 'video'
    file_path: string
    file_url?: string
    order: number
}

interface Props {
    slides: Slide[]
    folderId: number
}

export default function SlideGrid({ slides: initialSlides, folderId }: Props) {
    const [slides, setSlides]   = useState(initialSlides)
    const [dragIndex, setDragIndex] = useState<number | null>(null)

    function handleDragStart(index: number) {
        setDragIndex(index)
    }

    function handleDragOver(e: React.DragEvent, index: number) {
        e.preventDefault()
        if (dragIndex === null || dragIndex === index) return

        const reordered    = [...slides]
        const [moved]      = reordered.splice(dragIndex, 1)
        reordered.splice(index, 0, moved)
        setDragIndex(index)
        setSlides(reordered)
    }

    function handleDragEnd() {
        setDragIndex(null)
        router.patch(`/admin/folders/${folderId}/slides/reorder`, {
            slides: slides.map((slide, index) => ({
                id:    slide.id,
                order: index + 1,
            })),
        }, { preserveScroll: true })
    }

    if (slides.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-muted-foreground text-sm">
                    No slides yet. Upload some files to get started.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {slides.map((slide, index) => (
                <SlideCard
                    key={slide.id}
                    slide={slide}
                    index={index}
                    folderId={folderId}
                    isDragging={dragIndex === index}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                />
            ))}
        </div>
    )
}