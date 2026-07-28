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
import KeyTopicsInput from './KeyTopicsInput'
import { type CompanyFolder } from './FolderCard'

interface JobSpecificTarget {
    companyId: number
    name: string
    key_topics: string[]
}

interface Props {
    open: boolean
    onClose: () => void
    folder?: CompanyFolder | null
    jobSpecificTarget?: JobSpecificTarget | null
}

export default function EditFolderDialog({ open, onClose, folder, jobSpecificTarget }: Props) {
    const isJobSpecific = !!jobSpecificTarget

    const { data, setData, put, processing, errors, reset } = useForm({
        name: '',
        key_topics: [''] as string[],
    })

    useEffect(() => {
        if (jobSpecificTarget) {
            setData('name', jobSpecificTarget.name)
            setData('key_topics', jobSpecificTarget.key_topics.length ? jobSpecificTarget.key_topics : [''])
        } else if (folder) {
            setData('name', folder.name)
            setData('key_topics', folder.key_topics?.length ? folder.key_topics : [''])
        }
    }, [folder, jobSpecificTarget, open])

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (isJobSpecific && jobSpecificTarget) {
            put(`/admin/folders/${jobSpecificTarget.companyId}/job-specific`, {
                onSuccess: () => {
                    reset()
                    onClose()
                },
            })
        } else if (folder) {
            put(`/admin/folders/${folder.id}`, {
                onSuccess: () => {
                    reset()
                    onClose()
                },
            })
        }
    }

    const title = isJobSpecific ? 'Edit Job-Specific Training' : 'Edit Folder'
    const description = isJobSpecific
        ? "This name and key topics apply to every position's job-specific training folder for this company."
        : 'Update the folder name and its key topics below.'

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
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

                    <KeyTopicsInput
                        topics={data.key_topics}
                        onChange={topics => setData('key_topics', topics)}
                    />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
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