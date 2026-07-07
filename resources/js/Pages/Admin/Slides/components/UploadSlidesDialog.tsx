import { useForm } from '@inertiajs/react'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog'
import { Upload } from 'lucide-react'

interface Props {
    folderId: number
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function UploadSlidesDialog({ folderId, open, onOpenChange }: Props) {
    const fileRef = useRef<HTMLInputElement>(null)

    const { setData, post, processing, errors, reset, progress } = useForm({
        files: null as FileList | null,
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        post(`/admin/folders/${folderId}/slides`, {
            forceFormData: true,
            onSuccess: () => {
                reset()
                if (fileRef.current) fileRef.current.value = ''
                onOpenChange(false)
            },
        })
    }

    function handleOpenChange(open: boolean) {
        if (!open) {
            reset()
            if (fileRef.current) fileRef.current.value = ''
        }
        onOpenChange(open)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Upload Slides</DialogTitle>
                    <DialogDescription>
                        Upload images or videos. You can select multiple files at once.
                        Maximum 100MB per file.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="files">Select Files</Label>
                        <div className="border-2 border-dashed rounded-xl p-6 text-center space-y-2 hover:border-primary/50 transition-colors">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Images (JPG, PNG, WebP) or Videos (MP4, MOV)
                            </p>
                            <input
                                ref={fileRef}
                                id="files"
                                type="file"
                                accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
                                multiple
                                onChange={e => setData('files', e.target.files)}
                                className="w-full text-sm text-muted-foreground file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                            />
                        </div>
                        {errors.files && (
                            <p className="text-sm text-destructive">{errors.files}</p>
                        )}
                    </div>

                    {progress && (
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Uploading...</span>
                                <span>{progress.percentage}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5">
                                <div
                                    className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${progress.percentage}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="gap-2">
                            <Upload className="h-4 w-4" />
                            {processing ? 'Uploading...' : 'Upload'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}