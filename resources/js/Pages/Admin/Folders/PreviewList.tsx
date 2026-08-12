import { Link, router } from '@inertiajs/react'
import { ArrowLeft } from 'lucide-react'
import PreviewFolderCard, { type PreviewFolder } from "./components/PreviewFolderCard"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'

interface Company {
    id: number;
    name: string;
    slug: string;
}

interface JobPosition {
    id: number;
    name: string;
    slug: string;
}

interface Props {
    folders: PreviewFolder[]
    company: Company
    jobPosition: JobPosition | null
    jobPositions: JobPosition[]
}

export default function PreviewList({ folders, company, jobPosition, jobPositions }: Props) {
    const [selectedId, setSelectedId] = useState(jobPosition ? String(jobPosition.id) : '')

    function handleSelectPosition(value: string) {
        setSelectedId(value)
        const params = new URLSearchParams({
            company_id: String(company.id),
            job_position_id: value,
        })
        router.visit(`/admin/folders/preview-list?${params.toString()}`)
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-zinc-950">
            <div className="flex shrink-0 items-center justify-between bg-indigo-600 px-6 py-2.5 text-sm text-white">
                <div className="flex items-center gap-2">
                    <span className="font-medium">Admin Preview</span>
                    <span className="text-indigo-300">—</span>
                    <span className="text-indigo-200">
                        {company.name}
                        {jobPosition && <span> · {jobPosition.name}</span>}
                    </span>
                </div>
                <Link
                    href={`/admin/folders/${company.slug}`}
                    className="inline-flex items-center gap-1.5 text-indigo-200 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to folders
                </Link>
            </div>

            <div className="mx-auto w-full max-w-5xl flex-1 space-y-8 px-6 py-12">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-white">
                            Orientation Modules
                        </h1>
                        <p className="text-sm text-zinc-400">
                            {folders.length === 0
                                ? "No folders are assigned to this audience yet."
                                : `${folders.length} ${folders.length === 1 ? "module" : "modules"} in this orientation.`}
                        </p>
                    </div>

                    {jobPositions.length > 0 && (
                        <Select value={selectedId} onValueChange={handleSelectPosition}>
                            <SelectTrigger className=" border-zinc-700 bg-zinc-900 text-white w-80">
                                <SelectValue placeholder="View as job position" />
                            </SelectTrigger>
                            <SelectContent position='popper'>
                                {jobPositions.map((position) => (
                                    <SelectItem key={position.id} value={String(position.id)}>
                                        {position.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {folders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {folders.map((folder, index) => (
                            <PreviewFolderCard key={folder.id} folder={folder} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-zinc-800 py-16 text-center text-zinc-500">
                        No folders assigned to this audience yet.
                    </div>
                )}
            </div>
        </div>
    )
}
