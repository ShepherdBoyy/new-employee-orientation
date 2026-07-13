import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Film, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface Slide {
    id: number
    type: 'image' | 'video'
    file_url: string
    order: number
}

interface Props {
    slide: Slide
    index: number
    onDeleteRequest: (slide: Slide) => void
}

export default function SlideItem({ slide, index, onDeleteRequest }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: slide.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative overflow-hidden rounded-xl border bg-card transition-colors hover:border-foreground/15"
        >
            <div className="relative aspect-video bg-muted">
                {slide.type === 'video' ? (
                    <video src={slide.file_url} className="h-full w-full object-cover" muted />
                ) : (
                    <img src={slide.file_url} alt={`Slide ${index + 1}`} className="h-full w-full object-cover" />
                )}

                <Badge
                    variant="secondary"
                    className="absolute left-2 top-2 gap-1 bg-background/80 text-[11px] backdrop-blur"
                >
                    {slide.type === 'video' ? <Film className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                    {slide.type}
                </Badge>

                <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => onDeleteRequest(slide)}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>

            <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground">Slide {index + 1}</span>
                <button
                    {...attributes}
                    {...listeners}
                    className="text-muted-foreground/40 hover:text-muted-foreground cursor-grab active:cursor-grabbing"
                >
                    <GripVertical className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}