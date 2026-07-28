import { Link } from '@inertiajs/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Files, Pencil, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export interface CompanyFolder {
    id: number
    slug: string
    name: string
    slides_count: number
    order: number
    key_topics: string[]
}

interface Props {
    folder: CompanyFolder
    onEdit: (folder: CompanyFolder) => void
    onDeleteRequest: (folder: CompanyFolder) => void
}

export default function FolderCard({ folder, onEdit, onDeleteRequest }: Props) {
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
            className="group relative flex flex-col justify-between rounded-2xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
            <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Files className="h-5 w-5" />
                </div>
                <button
                    {...attributes}
                    {...listeners}
                    className="relative z-10 text-muted-foreground/40 opacity-0 transition-opacity hover:text-muted-foreground group-hover:opacity-100 cursor-grab active:cursor-grabbing"
                >
                    <GripVertical className="h-4 w-4" />
                </button>
            </div>

            <h3 className="mt-4 line-clamp-2 text-sm font-semibold leading-snug">{folder.name}</h3>

            <div className="mt-4 flex items-center justify-between">
                <Badge variant="secondary" className="font-normal">
                    {folder.slides_count} {folder.slides_count === 1 ? 'slide' : 'slides'}
                </Badge>

                <div className="relative z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(folder)}>
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDeleteRequest(folder)}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            <Link
                href={`/admin/folders/${folder.slug}/slides`}
                className="absolute inset-0"
                aria-label={folder.name}
            />
        </div>
    )
}