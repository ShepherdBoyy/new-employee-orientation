import { useState } from 'react'
import { Head, router } from '@inertiajs/react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FolderList from './components/FolderList'
import FolderDialog from './components/FolderDialog'
import FolderPageHeader from './FolderPageHeader'
import { type Folder } from './components/FolderItem'
import Master from '@/Layout/Master'

interface Props {
    folders: Folder[]
}

export default function Global({ folders }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingFolder, setEditingFolder] = useState<Folder | null>(null)

    function handleEdit(folder: Folder) {
        setEditingFolder(folder)
        setDialogOpen(true)
    }

    function handleDelete(folder: Folder) {
        router.delete(`/admin/folders/${folder.id}`, { preserveScroll: true })
    }

    function handleDialogClose() {
        setDialogOpen(false)
        setEditingFolder(null)
    }

    return (
        <Master>
            <Head title="Global Folders" />

            <div className="w-full space-y-6 p-6 lg:p-8">
                <FolderPageHeader
                    title="Global Folders"
                    description="Visible to every employee across all companies, regardless of position."
                    actions={
                        <Button onClick={() => setDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Folder
                        </Button>
                    }
                />

                <FolderList
                    folders={folders}
                    reorderRoute="/admin/folders/reorder-targets"
                    reorderData={{ company_id: null, job_position_id: null }}
                    previewHref={folder => `/admin/folders/${folder.id}/preview`}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <FolderDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                folder={editingFolder}
                storeRoute="/admin/folders"
                extraData={{ context: 'global' }}
            />
        </Master>
    )
}