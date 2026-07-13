import { useEffect, useState } from 'react'
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { router } from '@inertiajs/react'
import { FolderPlus } from 'lucide-react'
import FolderItem, { type Folder } from './FolderItem'
import DeleteFolderDialog from './DeleteFolderDialog'

interface Props {
    folders: Folder[]
    reorderRoute: string
    reorderData?: Record<string, number | null>
    previewHref: (folder: Folder) => string
    onEdit: (folder: Folder) => void
    onDelete: (folder: Folder) => void
}

export default function FolderList({
    folders: initialFolders,
    reorderRoute,
    reorderData = {},
    previewHref,
    onEdit,
    onDelete,
}: Props) {
    const [folders, setFolders] = useState(initialFolders)
    const [deletingFolder, setDeletingFolder] = useState<Folder | null>(null)
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }))

    // Keep local state in sync whenever Inertia gives us fresh props
    useEffect(() => {
        setFolders(initialFolders)
    }, [initialFolders])

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = folders.findIndex(f => f.id === active.id)
        const newIndex = folders.findIndex(f => f.id === over.id)
        const reordered = arrayMove(folders, oldIndex, newIndex)

        setFolders(reordered)

        router.patch(
            reorderRoute,
            {
                ...reorderData,
                folders: reordered.map((folder, index) => ({ id: folder.id, order: index + 1 })),
            },
            { preserveScroll: true }
        )
    }

    function handleDeleteConfirm() {
        if (deletingFolder) {
            onDelete(deletingFolder)
            setDeletingFolder(null)
        }
    }

    if (folders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <FolderPlus className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                    <p className="text-sm font-medium">No folders yet</p>
                    <p className="text-xs text-muted-foreground">Create one to get started.</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={folders.map(f => f.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {folders.map(folder => (
                            <FolderItem
                                key={folder.id}
                                folder={folder}
                                onEdit={onEdit}
                                onDeleteRequest={setDeletingFolder}
                                previewHref={previewHref(folder)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <DeleteFolderDialog
                folder={deletingFolder}
                onCancel={() => setDeletingFolder(null)}
                onConfirm={handleDeleteConfirm}
            />
        </>
    )
}