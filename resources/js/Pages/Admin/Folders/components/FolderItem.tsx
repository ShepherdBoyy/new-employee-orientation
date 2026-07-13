import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { router } from '@inertiajs/react'
import { GripVertical, Pencil, Trash2, Eye, FolderOpen, Files } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface Folder {
    id: number
    name: string
    order: number
    slides_count: number
    targets: {
        id: number
        company_id: number | null
        job_position_id: number | null
        audience_label?: string
    }[]
}

interface Props {
    folder: Folder
    onEdit: (folder: Folder) => void
    onDeleteRequest: (folder: Folder) => void
    previewHref: string
}

export default function FolderItem({ folder, onEdit, onDeleteRequest, previewHref }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: folder.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group flex items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-colors hover:border-foreground/15"
        >
            <button
                {...attributes}
                {...listeners}
                className="shrink-0 text-muted-foreground/40 transition hover:text-muted-foreground cursor-grab active:cursor-grabbing"
            >
                <GripVertical className="h-5 w-5" />
            </button>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Files className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-none">{folder.name}</p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                    {folder.slides_count} {folder.slides_count === 1 ? 'slide' : 'slides'}
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button variant="ghost" size="sm" onClick={() => router.visit(`/admin/folders/${folder.id}/slides`)}>
                    <FolderOpen className="mr-1.5 h-4 w-4" />
                    Open
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.visit(previewHref)}>
                    <Eye className="mr-1.5 h-4 w-4" />
                    Preview
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(folder)}>
                    <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onDeleteRequest(folder)}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    )
}