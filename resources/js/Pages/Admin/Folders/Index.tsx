import { useState } from 'react'
import { Head } from '@inertiajs/react'
import Master from '@/Layout/Master'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FolderPlus } from 'lucide-react'
import FolderList from './components/FolderList'
import CreateFolderDialog from './components/CreateFolderDialog'
import EditFolderDialog from './components/EditFolderDialog'

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
}

export default function FoldersIndex({ folders }: Props) {
    const [createOpen, setCreateOpen]       = useState(false)
    const [editOpen, setEditOpen]           = useState(false)
    const [editingFolder, setEditingFolder] = useState<Folder | null>(null)

    function handleEdit(folder: Folder) {
        setEditingFolder(folder)
        setEditOpen(true)
    }

    return (
        <Master>
            <Head title="Folders" />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Folders
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Create and organize orientation modules. Drag to reorder.
                        </p>
                    </div>
                    <Button onClick={() => setCreateOpen(true)} className="gap-2">
                        <FolderPlus className="h-4 w-4" />
                        New Folder
                    </Button>
                </div>

                <Separator />

                {/* Folder list */}
                <FolderList
                    folders={folders}
                    onEdit={handleEdit}
                />
            </div>

            {/* Dialogs */}
            <CreateFolderDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
            />

            <EditFolderDialog
                folder={editingFolder}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
        </Master>
    )
}