import { useState } from 'react'
import { router } from '@inertiajs/react'
import FolderCard from "./FolderCard"

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
    folders: Folder[]
    onEdit: (folder: Folder) => void
}

export default function FolderList({ folders: initialFolders, onEdit }: Props) {
    const [folders, setFolders] = useState(initialFolders)
    const [dragIndex, setDragIndex] = useState<number | null>(null)

    function handleDragStart(index: number) {
        setDragIndex(index)
    }

    function handleDragOver(e: React.DragEvent, index: number) {
        e.preventDefault()
        if (dragIndex === null || dragIndex === index) return

        const reordered = [...folders]
        const [moved] = reordered.splice(dragIndex, 1)
        reordered.splice(index, 0, moved)
        setDragIndex(index)
        setFolders(reordered)
    }

    function handleDragEnd() {
        setDragIndex(null)
        router.patch('/admin/folders/reorder', {
            folders: folders.map((folder, index) => ({
                id:    folder.id,
                order: index + 1,
            })),
        }, { preserveScroll: true })
    }

    if (folders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-muted-foreground text-sm">
                    No folders yet. Create your first folder to get started.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            {folders.map((folder, index) => (
                <FolderCard
                    key={folder.id}
                    folder={folder}
                    index={index}
                    onEdit={onEdit}
                    isDragging={dragIndex === index}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                />
            ))}
        </div>
    )
}