import { useState } from 'react'
import { Head, router, Link } from '@inertiajs/react'
import { Plus, ArrowLeft, Eye, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import FolderList from './components/FolderList'
import FolderDialog from './components/FolderDialog'
import FolderPageHeader from './FolderPageHeader'
import { type Folder } from './components/FolderItem'
import Master from '@/Layout/Master'

interface JobPosition {
    id: number
    name: string
    slug: string
}

interface CompanyType {
    id: number
    name: string
    jobs: JobPosition[]
    slug: string
}

interface Props {
    company: CompanyType
    folders: Folder[]
}

export default function Company({ company, folders }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingFolder, setEditingFolder] = useState<Folder | null>(null)
    const [previewPositionId, setPreviewPositionId] = useState<string>('')

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

    function handlePreview() {
        const params = new URLSearchParams({
            company_id: String(company.id),
            ...(previewPositionId ? { job_position_id: previewPositionId } : {}),
        })
        router.visit(`/admin/folders/preview-list?${params.toString()}`)
    }

    return (
        <Master>
            <Head title={`${company.name} — Folders`} />

            <div className="w-full space-y-6 p-6 lg:p-8">
                <FolderPageHeader
                    title={company.name}
                    description="Folders visible to every employee at this company, across all positions."
                    actions={
                        <Button onClick={() => setDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            New Folder
                        </Button>
                    }
                />

                <Card className="border-dashed">
                    <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <p className="text-sm font-medium">Preview as employee</p>
                            <p className="text-xs text-muted-foreground">
                                Select a job position to simulate their exact folder list.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={previewPositionId} onValueChange={setPreviewPositionId}>
                                <SelectTrigger className="w-52">
                                    <SelectValue placeholder="All positions" />
                                </SelectTrigger>
                                <SelectContent>
                                    {company.jobs.map(position => (
                                        <SelectItem key={position.id} value={String(position.id)}>
                                            {position.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={handlePreview}>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {company.jobs.length > 0 && (
                    <div className="space-y-2">
                        <p className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                            <Briefcase className="h-3.5 w-3.5" />
                            View folders by job position
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {company.jobs.map(position => (
                                <Link
                                    key={position.id}
                                    href={`/admin/folders/${company.slug}/job-positions/${position.slug}`}
                                    className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm text-muted-foreground transition hover:border-foreground/20 hover:text-foreground"
                                >
                                    {position.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <FolderList
                    folders={folders}
                    reorderRoute="/admin/folders/reorder-targets"
                    reorderData={{ company_id: company.id, job_position_id: null }}
                    previewHref={folder => `/admin/folders/${folder.slug}/preview`}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <FolderDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                folder={editingFolder}
                storeRoute="/admin/folders"
                extraData={{ context: 'company', company_id: company.id }}
            />
        </Master>
    )
}