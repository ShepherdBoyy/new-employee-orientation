import { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type Folder } from './FolderItem'

interface Props {
    open: boolean
    onClose: () => void
    folder?: Folder | null
    storeRoute: string
    extraData?: Record<string, string | number | null>
}

export default function FolderDialog({ open, onClose, folder, storeRoute, extraData = {} }: Props) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        ...extraData,
    })

    useEffect(() => {
        if (folder) {
            setData('name', folder.name)
        } else {
            reset()
        }
    }, [folder, open])

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (folder) {
            put(`/admin/folders/${folder.id}`, { onSuccess: () => { reset(); onClose() } })
        } else {
            post(storeRoute, { onSuccess: () => { reset(); onClose() } })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{folder ? 'Edit Folder' : 'Create Folder'}</DialogTitle>
                    <DialogDescription>
                        {folder ? 'Update the folder name below.' : 'Give this module a clear, descriptive name.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">Folder name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="e.g. Company Overview"
                            autoFocus
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : folder ? 'Save Changes' : 'Create Folder'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}