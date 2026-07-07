import { router } from '@inertiajs/react'
import { Badge } from '@/components/ui/badge'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { GripVertical, Trash2, Film, Image } from 'lucide-react'

export interface Slide {
    id: number
    folder_id: number
    type: 'image' | 'video'
    file_path: string
    file_url?: string
    order: number
}

interface Props {
    slide: Slide
    index: number
    folderId: number
    isDragging: boolean
    onDragStart: (index: number) => void
    onDragOver: (e: React.DragEvent, index: number) => void
    onDragEnd: () => void
}

export default function SlideCard({
    slide,
    index,
    folderId,
    isDragging,
    onDragStart,
    onDragOver,
    onDragEnd,
}: Props) {
    function handleDelete() {
        router.delete(`/admin/folders/${folderId}/slides/${slide.id}`, {
            preserveScroll: true,
        })
    }

    return (
        <div
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={e => onDragOver(e, index)}
            onDragEnd={onDragEnd}
            className={`bg-card border rounded-xl overflow-hidden cursor-grab active:cursor-grabbing transition-all ${
                isDragging ? 'opacity-50 ring-2 ring-primary shadow-lg' : 'hover:shadow-sm'
            }`}
        >
            {/* Media preview */}
            <div className="relative aspect-video bg-muted">
                {slide.type === 'video' ? (
                    <video
                        src={slide.file_url}
                        className="w-full h-full object-cover"
                        muted
                    />
                ) : (
                    <img
                        src={slide.file_url}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute top-2 left-2">
                    <Badge
                        variant="secondary"
                        className="gap-1 text-xs"
                    >
                        {slide.type === 'video'
                            ? <Film className="h-3 w-3" />
                            : <Image className="h-3 w-3" />
                        }
                        {slide.type}
                    </Badge>
                </div>
            </div>

            {/* Card footer */}
            <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                        Slide {index + 1}
                    </span>
                </div>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete slide?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete slide {index + 1}.
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    )
}