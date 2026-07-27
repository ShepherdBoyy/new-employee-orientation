import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import { Plus, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import FolderGrid from './components/FolderGrid'
import CreateFolderDialog from './components/CreateFolderDialog'
import DeleteFolderDialog from './components/DeleteFolderDialog'
import { type CompanyFolder } from './components/FolderCard'
import Master from '@/Layout/Master'

interface JobPosition {
    id: number
    name: string
}

interface CompanyType {
    id: number
    name: string
    slug: string
    jobs: JobPosition[]
}

interface JobSpecificSummary {
    total_positions: number
    order: number
    name: string
}

interface Props {
    company: CompanyType
    companyWideFolders: CompanyFolder[]
    jobSpecificSummary: JobSpecificSummary
}

export default function Company({ company, companyWideFolders: initialFolders, jobSpecificSummary }: Props) {
    const [folders, setFolders] = useState(initialFolders)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingFolder, setEditingFolder] = useState<CompanyFolder | null>(null)
    const [deletingFolder, setDeletingFolder] = useState<CompanyFolder | null>(null)
    const [previewPositionId, setPreviewPositionId] = useState<string>('')
    const [editingJobSpecific, setEditingJobSpecific] = useState(false)

    useEffect(() => setFolders(initialFolders), [initialFolders])

    function openCreate() {
        setEditingFolder(null)
        setDialogOpen(true)
    }

    function openEdit(folder: CompanyFolder) {
        setEditingFolder(folder)
        setDialogOpen(true)
    }

    function handleDialogClose() {
        setDialogOpen(false)
        setEditingFolder(null)
        setEditingJobSpecific(false)
    }

    function handleDeleteConfirm() {
        if (deletingFolder) {
            router.delete(`/admin/folders/${deletingFolder.id}`, { preserveScroll: true })
            setDeletingFolder(null)
        }
    }

    function handlePreview() {
        const params = new URLSearchParams({
            company_id: String(company.id),
            ...(previewPositionId ? { job_position_id: previewPositionId } : {}),
        })
        router.visit(`/admin/folders/preview-list?${params.toString()}`)
    }

    function openEditJobSpecific() {
        setEditingFolder(null)
        setEditingJobSpecific(true)
        setDialogOpen(true)
    }

    return (
        <Master>
            <div className="w-full space-y-6">
                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">{company.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Orientation modules for this company.
                        </p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Folder
                    </Button>
                </div>

                <Card className="border-dashed">
                    <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium">Preview as employee</p>
                            <p className="text-xs text-muted-foreground">
                                Select a job position to simulate their exact folder list.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={previewPositionId} onValueChange={setPreviewPositionId}>
                                <SelectTrigger className="w-52">
                                    <SelectValue placeholder="Select position" />
                                </SelectTrigger>
                                <SelectContent>
                                    {company.jobs.map(position => (
                                        <SelectItem key={position.id} value={String(position.id)}>
                                            {position.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={handlePreview} disabled={!previewPositionId}>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <FolderGrid
                    companyId={company.id}
                    companySlug={company.slug}
                    folders={folders}
                    jobSpecificSummary={jobSpecificSummary}
                    onEdit={openEdit}
                    onEditJobSpecific={openEditJobSpecific}
                    onDeleteRequest={setDeletingFolder}
                />
            </div>

            <CreateFolderDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                folder={editingFolder}
                companyId={company.id}
                jobSpecificName={editingJobSpecific ? jobSpecificSummary?.name : null}
            />

            <DeleteFolderDialog
                folder={deletingFolder}
                onCancel={() => setDeletingFolder(null)}
                onConfirm={handleDeleteConfirm}
            />
        </Master>
    )
}