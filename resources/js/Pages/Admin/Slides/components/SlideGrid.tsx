import { useEffect, useState } from 'react'
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { router } from '@inertiajs/react'
import { ImageIcon } from 'lucide-react'
import SlideItem, { type Slide } from './SlideItem'
import DeleteSlideDialog from './DeleteSlideDialog'

interface Props {
    slides: Slide[]
    folderId: number
}

export default function SlideGrid({ slides: initialSlides, folderId }: Props) {
    const [slides, setSlides] = useState(initialSlides)
    const [deletingSlide, setDeletingSlide] = useState<Slide | null>(null)
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

    useEffect(() => {
        setSlides(initialSlides)
    }, [initialSlides])

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = slides.findIndex(s => s.id === active.id)
        const newIndex = slides.findIndex(s => s.id === over.id)
        const reordered = arrayMove(slides, oldIndex, newIndex)

        setSlides(reordered)

        router.patch(
            `/admin/folders/${folderId}/slides/reorder`,
            { slides: reordered.map((slide, index) => ({ id: slide.id, order: index + 1 })) },
            { preserveScroll: true }
        )
    }

    function handleDeleteConfirm() {
        if (deletingSlide) {
            router.delete(`/admin/folders/${folderId}/slides/${deletingSlide.id}`, {
                preserveScroll: true,
            })
            setDeletingSlide(null)
        }
    }

    if (slides.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                    <p className="text-sm font-medium">No slides yet</p>
                    <p className="text-xs text-muted-foreground">Upload images or videos above.</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={slides.map(s => s.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {slides.map((slide, index) => (
                            <SlideItem
                                key={slide.id}
                                slide={slide}
                                index={index}
                                onDeleteRequest={setDeletingSlide}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <DeleteSlideDialog
                open={!!deletingSlide}
                onCancel={() => setDeletingSlide(null)}
                onConfirm={handleDeleteConfirm}
            />
        </>
    )
}