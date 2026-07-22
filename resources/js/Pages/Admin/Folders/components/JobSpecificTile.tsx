import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { router } from '@inertiajs/react'
import { Users, ChevronRight, GripVertical, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Props {
    companySlug: string
    name: string
    totalPositions: number
    onEdit: () => void
}

export default function JobSpecificTile({ companySlug, name, totalPositions, onEdit }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: 'job-specific' })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    }

    function handleClick() {
        router.visit(`/admin/folders/${companySlug}/job-positions`)
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative flex flex-col justify-between rounded-2xl border border-dashed bg-muted/20 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg"
        >
            <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                    <Users className="h-5 w-5" />
                </div>
                <button
                    {...attributes}
                    {...listeners}
                    className="relative z-10 text-muted-foreground/40 opacity-0 transition-opacity hover:text-muted-foreground group-hover:opacity-100 cursor-grab active:cursor-grabbing"
                >
                    <GripVertical className="h-4 w-4" />
                </button>
            </div>

            <h3 className="mt-4 text-sm font-semibold leading-snug">{name}</h3>

            <div className="mt-4 flex items-center justify-between">
                <Badge variant="secondary" className="font-normal">
                    {totalPositions} positions
                </Badge>

                <div className="relative z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={e => {
                            e.stopPropagation()
                            onEdit()
                        }}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
            </div>

            <button onClick={handleClick} className="absolute inset-0" aria-label="Job-Specific Training" />
        </div>
    )
}