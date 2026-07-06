import { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
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

interface JobPosition {
    id: number
    company_id: number
    employee_type: 'office' | 'field'
    name: string
}

interface Props {
    position: JobPosition | null
    onClose: () => void
}

export default function EditJobPositionDialog({ position, onClose }: Props) {
    const form = useForm({ name: '' })

    useEffect(() => {
        if (position) {
            form.setData('name', position.name)
        }
    }, [position])

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        form.put(`/admin/job-positions/${position?.id}`, {
            onSuccess: () => onClose(),
        })
    }

    return (
        <Dialog open={!!position} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Job Position</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <Label>Position Name</Label>
                        <Input
                            value={form.data.name}
                            onChange={e => form.setData('name', e.target.value)}
                        />
                        {form.errors.name && (
                            <p className="text-xs text-red-500">{form.errors.name}</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}