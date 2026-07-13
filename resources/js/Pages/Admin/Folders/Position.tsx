import { useState } from 'react'
import { Head, router, Link } from '@inertiajs/react'
import { Plus, Eye, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import FolderList from './components/FolderList'
import FolderDialog from './components/FolderDialog'
import FolderPageHeader from './FolderPageHeader'
import { type Folder } from './components/FolderItem'
import Master from '@/Layout/Master'

interface JobPosition {
    id: number
    name: string
}

interface CompanyType {
    id: number
    name: string
    slug: string
}

interface Props {
    company: CompanyType
    jobPosition: JobPosition
    folders: Folder[]
}

export default function Position({ company, jobPosition, folders }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingFolder, setEditingFolder] = useState<Folder | null>(null)

    console.log(folders);

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
            job_position_id: String(jobPosition.id),
        })
        router.visit(`/admin/folders/preview-list?${params.toString()}`)
    }

    return (
        <Master>
            <Head title={`${jobPosition.name} — Folders`} />

            <div className="w-full space-y-6 p-6 lg:p-8">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Link href="/admin/companies" className="hover:text-foreground">
                        Companies
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <Link href={`/admin/folders/${company.slug}`} className="hover:text-foreground">
                        {company.name}
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">{jobPosition.name}</span>
                </div>

                <FolderPageHeader
                    title={jobPosition.name}
                    description={
                        <>
                            Folders visible only to <span className="font-medium">{jobPosition.name}</span> employees
                            at <span className="font-medium">{company.name}</span>.
                        </>
                    }
                    actions={
                        <>
                            <Button variant="outline" onClick={handlePreview}>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                            </Button>
                            <Button onClick={() => setDialogOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Folder
                            </Button>
                        </>
                    }
                />

                <FolderList
                    folders={folders}
                    reorderRoute="/admin/folders/reorder-targets"
                    reorderData={{ company_id: company.id, job_position_id: jobPosition.id }}
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
                extraData={{
                    context: 'position',
                    company_id: company.id,
                    job_position_id: jobPosition.id,
                }}
            />
        </Master>
    )
}