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

interface Props {
    open: boolean
    onClose: () => void
    folder?: CompanyFolder | null
    companyId: number
    jobSpecificName?: string | null
    jobSpecificKeyTopics?: string[] | null
}

export default function CreateFolderDialog({
    open,
    onClose,
    folder,
    companyId,
    jobSpecificName,
    jobSpecificKeyTopics,
}: Props) {
    const isJobSpecificRename = jobSpecificName !== undefined && jobSpecificName !== null

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        company_id: companyId,
        key_topics: [''] as string[],
    })

    useEffect(() => {
        if (isJobSpecificRename) {
            setData('name', jobSpecificName ?? '')
            setData('key_topics', jobSpecificKeyTopics?.length ? jobSpecificKeyTopics : [''])
        } else if (folder) {
            setData('name', folder.name)
            setData('key_topics', folder.key_topics?.length ? folder.key_topics : [''])
        } else {
            reset()
            setData('company_id', companyId)
            setData('key_topics', [''])
        }
    }, [folder, jobSpecificName, jobSpecificKeyTopics, open])

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (isJobSpecificRename) {
            put(`/admin/folders/${companyId}/job-specific`, {
                onSuccess: () => { reset(); onClose() },
            })
        } else if (folder) {
            put(`/admin/folders/${folder.id}`, {
                onSuccess: () => { reset(); onClose() },
            })
        } else {
            post('/admin/folders', {
                onSuccess: () => { reset(); onClose() },
            })
        }
    }

    const title = isJobSpecificRename ? 'Edit Job-Specific Training' : folder ? 'Edit Folder' : 'Create Folder'
    const description = isJobSpecificRename
        ? 'This name and key topics apply to every position\'s job-specific training folder for this company.'
        : folder
          ? 'Update the folder name and its key topics below.'
          : 'Give this module a clear, descriptive name and list what it covers.'

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