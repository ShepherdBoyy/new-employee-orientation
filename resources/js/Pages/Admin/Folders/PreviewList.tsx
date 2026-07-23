import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import PreviewFolderCard, { type PreviewFolder } from "./components/PreviewFolderCard"

interface Company {
    id: number
    name: string
    slug: string
}

interface JobPosition {
    id: number
    name: string
    slug: string
}

interface Props {
    folders: PreviewFolder[]
    company: Company
    jobPosition: JobPosition | null
}

export default function PreviewList({ folders, company, jobPosition }: Props) {
    return (
        <>
            <Head title={`Preview — ${company.name}`} />

            <div className="flex min-h-screen w-full flex-col bg-zinc-950">
                {/* Admin preview banner — preview only */}
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
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-white">Orientation Modules</h1>
                        <p className="text-sm text-zinc-400">
                            {folders.length === 0
                                ? 'No folders are assigned to this audience yet.'
                                : `${folders.length} ${folders.length === 1 ? 'module' : 'modules'} in this orientation.`}
                        </p>
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

                    {/* Final Acknowledgement teaser — preview only, dimmed, non-interactive */}
                    {/* {folders.length > 0 && (
                        <div className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 opacity-50">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-900">
                                <CheckCircle2 className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-white">Final Acknowledgement</p>
                                <p className="mt-0.5 text-xs text-zinc-400">Shown after all modules are completed</p>
                            </div>
                            <Badge variant="outline" className="shrink-0 border-zinc-700 text-zinc-500">
                                Last step
                            </Badge>
                        </div>
                    )} */}
                </div>
            </div>
        </>
    )
}