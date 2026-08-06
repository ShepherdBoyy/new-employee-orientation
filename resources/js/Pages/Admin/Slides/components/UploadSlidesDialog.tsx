import { useRef, useState } from 'react'
import { router } from '@inertiajs/react'
import axios from 'axios'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Upload, X, FileVideo, FileImage, CheckCircle2 } from 'lucide-react'

interface Props {
    open: boolean
    onClose: () => void
    folderId: number
    topicId: number
}

export default function UploadSlidesDialog({ open, onClose, folderId, topicId }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [dragOver, setDragOver] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [done, setDone] = useState(false)
    const [error, setError] = useState<string | null>(null)

    function resetState() {
        setSelectedFiles([])
        setProgress(0)
        setUploading(false)
        setDone(false)
        setError(null)
    }

    function handleClose() {
        if (uploading) return
        resetState()
        onClose()
    }

    function addFiles(files: FileList | null) {
        if (!files) return
        setSelectedFiles(prev => [...prev, ...Array.from(files)])
    }

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        addFiles(e.target.files)
        e.target.value = ''
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        setDragOver(false)
        addFiles(e.dataTransfer.files)
    }

    function removeFile(index: number) {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    }

    async function handleUpload() {
        if (selectedFiles.length === 0) return

        setUploading(true)
        setError(null)

        const formData = new FormData()
        selectedFiles.forEach(file => formData.append('files[]', file))

        try {
            await axios.post(
                `/admin/folders/${folderId}/topics/${topicId}/slides`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (event) => {
                        if (event.total) {
                            setProgress(Math.round((event.loaded / event.total) * 100))
                        }
                    },
                }
            )

            setDone(true)

            setTimeout(() => {
                resetState()
                onClose()
                router.reload({ only: ['slides'] })
            }, 800)
        } catch (err: any) {
            setUploading(false)
            setError(
                err?.response?.data?.message ?? 'Upload failed. Please check your files and try again.'
            )
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Upload Slides</DialogTitle>
                    <DialogDescription>
                        Add images or videos to this topic. You can select multiple files at once.
                    </DialogDescription>
                </DialogHeader>

                {!uploading && !done && (
                    <>
                        <div
                            onDrop={handleDrop}
                            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                            onDragLeave={() => setDragOver(false)}
                            onClick={() => fileInputRef.current?.click()}
                            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-10 text-center transition ${
                                dragOver
                                    ? 'border-primary bg-primary/5'
                                    : 'border-muted-foreground/20 hover:border-muted-foreground/40 hover:bg-muted/40'
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
                            <Upload className={`h-6 w-6 ${dragOver ? 'text-primary' : 'text-muted-foreground/50'}`} />
                            <p className="text-sm font-medium">Drop files here or click to browse</p>
                            <p className="text-xs text-muted-foreground">Images and videos up to 100MB each</p>
                        </div>

                        {selectedFiles.length > 0 && (
                            <div className="max-h-40 space-y-1.5 overflow-y-auto">
                                {selectedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-1.5"
                                    >
                                        {file.type.startsWith('video') ? (
                                            <FileVideo className="h-3.5 w-3.5 shrink-0 text-purple-500" />
                                        ) : (
                                            <FileImage className="h-3.5 w-3.5 shrink-0 text-blue-500" />
                                        )}
                                        <span className="flex-1 truncate text-xs">{file.name}</span>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="shrink-0 text-muted-foreground hover:text-destructive"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </>
                )}

                {uploading && !done && (
                    <div className="space-y-3 py-4">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">
                                Uploading {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'}...
                            </span>
                            <span className="text-muted-foreground">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                )}

                {done && (
                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                        <p className="text-sm font-medium">Upload complete</p>
                    </div>
                )}

                {!uploading && !done && (
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={selectedFiles.length === 0}
                        >
                            Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}