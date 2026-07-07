import { router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { GripVertical, MoreHorizontal, Pencil, Trash2, FolderOpen, Images } from 'lucide-react'

interface Company {
    id: number
    name: string
    slug: string
    logo_path: string | null
    status: 'active' | 'inactive'
    users_count?: number
}

interface JobPosition {
    id: number
    name: string
    companies?: Company[]
}

interface FolderTarget {
    id: number
    folder_id: number
    company_id: number | null
    job_position_id: number | null
    order: number
    company?: Company
    job_position?: JobPosition
}

interface Folder {
    id: number
    name: string
    order: number
    slides_count?: number
    targets?: FolderTarget[]
}

interface Props {
    folder: Folder
    index: number
    onEdit: (folder: Folder) => void
    isDragging: boolean
    onDragStart: (index: number) => void
    onDragOver: (e: React.DragEvent, index: number) => void
    onDragEnd: () => void
}

export default function FolderCard({
    folder,
    index,
    onEdit,
    isDragging,
    onDragStart,
    onDragOver,
    onDragEnd,
}: Props) {
    function handleDelete() {
        router.delete(`/admin/folders/${folder.id}`)
    }

    function handleOpen() {
        router.get(`/admin/folders/${folder.id}`)
    }

    return (
        <div
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={e => onDragOver(e, index)}
            onDragEnd={onDragEnd}
            className={`flex items-center gap-4 p-4 bg-card border rounded-xl transition-all ${
                isDragging
                    ? 'opacity-50 ring-2 ring-primary shadow-lg'
                    : 'hover:shadow-sm'
            }`}
        >
            {/* Drag handle */}
            <div className="cursor-grab active:cursor-grabbing text-muted-foreground">
                <GripVertical className="h-5 w-5" />
            </div>

            {/* Order badge */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground">
                {index + 1}
            </div>

            {/* Folder info */}
            <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{folder.name}</p>
                <div className="flex items-center gap-2 mt-1">
                    <Images className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                        {folder.slides_count ?? 0} slides
                    </span>
                    {folder.targets && folder.targets.length > 0 && (
                        <Badge variant="secondary" className="text-xs h-5">
                            {folder.targets.length} {folder.targets.length === 1 ? 'target' : 'targets'}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleOpen}
                    className="gap-1.5"
                >
                    <FolderOpen className="h-3.5 w-3.5" />
                    Open
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(folder)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit name
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={e => e.preventDefault()}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete folder?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete <strong>{folder.name}</strong> and all slides inside it. This action cannot be undone.
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
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}