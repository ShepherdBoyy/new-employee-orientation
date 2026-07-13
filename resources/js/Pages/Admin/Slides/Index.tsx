import { useRef, useState } from 'react'
import { Head, router, Link } from '@inertiajs/react'
import { ArrowLeft, Upload, Eye, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SlideGrid from './components/SlideGrid'
import { type Slide } from './components/SlideItem'
import Master from '@/Layout/Master'

interface Target {
    id: number
    company_id: number | null
    job_position_id: number | null
    audience_label: string
}

interface Folder {
    id: number
    name: string
    targets: Target[]
}

interface Props {
    folder: Folder
    slides: Slide[]
}

export default function Index({ folder, slides }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)

    console.log(folder.targets);

    function handleFiles(files: FileList | null) {
        if (!files || files.length === 0) return
        setUploading(true)
        router.post(
            `/admin/folders/${folder.id}/slides`,
            { files: Array.from(files) },
            { forceFormData: true, preserveScroll: true, onFinish: () => setUploading(false) }
        )
    }

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        handleFiles(e.target.files)
        e.target.value = ''
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        setDragOver(false)
        handleFiles(e.dataTransfer.files)
    }

    return (
        <Master>
            <Head title={folder.name} />

            <div className="w-full space-y-6 p-6 lg:p-8">
                <Link
                    href="/admin/folders/global"
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to folders
                </Link>

                <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                        <h1 className="text-xl font-semibold tracking-tight">{folder.name}</h1>
                        <div className="flex flex-wrap gap-1.5">
                            {folder.targets.map(target => (
                                <Badge key={target.id} variant="secondary" className="text-xs font-normal">
                                    {target.audience_label}
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <Button variant="outline" onClick={() => router.visit(`/admin/folders/${folder.id}/preview`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                    </Button>
                </div>

                <div
                    onDrop={handleDrop}
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-14 text-center transition ${
                        dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/40'
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        className="hidden"
                        onChange={handleFileInput}
                    />
                    {uploading ? (
                        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
                    ) : (
                        <Upload className={`h-7 w-7 ${dragOver ? 'text-primary' : 'text-muted-foreground/50'}`} />
                    )}
                    <p className="text-sm font-medium">
                        {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
                    </p>
                    <p className="text-xs text-muted-foreground">Images and videos up to 100MB each</p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-medium text-muted-foreground">Slides</h2>
                        <span className="text-xs text-muted-foreground">
                            {slides.length} {slides.length === 1 ? 'slide' : 'slides'}
                        </span>
                    </div>
                    <SlideGrid slides={slides} folderId={folder.id} />
                </div>
            </div>
        </Master>
    )
}