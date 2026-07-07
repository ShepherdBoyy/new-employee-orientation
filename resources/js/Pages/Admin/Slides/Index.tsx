import { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import Master from '@/Layout/Master'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Upload, Target } from 'lucide-react'
import SlideGrid from './components/SlideGrid'
import UploadSlidesDialog from './components/UploadSlidesDialog'

export interface Company {
    id: number
    name: string
    slug: string
    logo_path: string | null
    status: 'active' | 'inactive'
    users_count?: number
}

export interface JobPosition {
    id: number
    name: string
    companies?: Company[]
}

export interface Folder {
    id: number
    name: string
    order: number
    slides_count?: number
    targets?: FolderTarget[]
}

export interface Slide {
    id: number
    folder_id: number
    type: 'image' | 'video'
    file_path: string
    file_url?: string
    order: number
}

export interface FolderTarget {
    id: number
    folder_id: number
    company_id: number | null
    job_position_id: number | null
    order: number
    company?: Company
    job_position?: JobPosition
}

interface Props {
    folder: Folder & {
        slides: Slide[]
        targets: FolderTarget[]
    }
}

export default function Index({ folder }: Props) {
    const [uploadOpen, setUploadOpen] = useState(false)

    return (
        <Master>
            <Head title={folder.name} />

            <div className="max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link
                                href="/admin/folders"
                                className="hover:text-foreground transition-colors flex items-center gap-1"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Folders
                            </Link>
                        </div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {folder.name}
                            </h1>
                            <Badge variant="secondary">
                                {folder.slides?.length ?? 0} slides
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => window.location.href = `/admin/folder-targets?folder_id=${folder.id}`}
                        >
                            <Target className="h-4 w-4" />
                            Manage Targets
                            {folder.targets?.length > 0 && (
                                <Badge variant="secondary" className="ml-1 h-5 text-xs">
                                    {folder.targets.length}
                                </Badge>
                            )}
                        </Button>
                        <Button
                            size="sm"
                            className="gap-2"
                            onClick={() => setUploadOpen(true)}
                        >
                            <Upload className="h-4 w-4" />
                            Upload Slides
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Targets summary */}
                {folder.targets && folder.targets.length > 0 && (
                    <div className="rounded-xl border bg-muted/40 p-4 space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Targeting Rules
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {folder.targets.map(target => (
                                <Badge key={target.id} variant="outline" className="text-xs">
                                    {target.company_id === null && target.job_position_id === null
                                        ? 'All employees'
                                        : target.company_id === null
                                        ? `All companies → ${target.job_position?.name ?? 'All positions'}`
                                        : target.job_position_id === null
                                        ? `${target.company?.name} → All positions`
                                        : `${target.company?.name} → ${target.job_position?.name}`
                                    }
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Slide grid */}
                <SlideGrid
                    slides={folder.slides ?? []}
                    folderId={folder.id}
                />
            </div>

            <UploadSlidesDialog
                folderId={folder.id}
                open={uploadOpen}
                onOpenChange={setUploadOpen}
            />
        </Master>
    )
}