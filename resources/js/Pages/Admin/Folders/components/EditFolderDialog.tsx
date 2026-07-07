import { useForm } from '@inertiajs/react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'

interface Company {
    id: number
    name: string
    slug: string
    logo_path: string | null
    status: 'active' | 'inactive'
    users_count?: number
}

interface JobPosition {
    id: number
    name: string
    companies?: Company[]
}

interface FolderTarget {
    id: number
    folder_id: number
    company_id: number | null
    job_position_id: number | null
    order: number
    company?: Company
    job_position?: JobPosition
}

interface Folder {
    id: number
    name: string
    order: number
    slides_count?: number
    targets?: FolderTarget[]
}

interface Props {
    folder: Folder | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function EditFolderDialog({ folder, open, onOpenChange }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: '',
    })

    useEffect(() => {
        if (folder) {
            setData('name', folder.name)
        }
    }, [folder])

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!folder) return
        put(`/admin/folders/${folder.id}`, {
            onSuccess: () => {
                reset()
                onOpenChange(false)
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Folder</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="edit-name">Folder Name</Label>
                        <Input
                            id="edit-name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="e.g. Company Overview"
                            autoFocus
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}