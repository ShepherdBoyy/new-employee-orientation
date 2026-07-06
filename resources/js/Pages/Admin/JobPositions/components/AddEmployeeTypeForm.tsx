import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Company {
    id: number
    name: string
    slug: string
    logo_path: string | null
    status: 'active' | 'inactive'
    users_count?: number
}

interface Props {
    companies: Company[]
}

export default function AddEmployeeTypeForm({ companies }: Props) {
    const form = useForm({
        company_id:    '',
        employee_type: '',
    })

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        form.post('/admin/employee-types', {
            onSuccess: () => form.reset(),
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Add Employee Type to Company</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                    <div className="flex-1 space-y-1">
                        <Label>Company</Label>
                        <Select
                            value={form.data.company_id}
                            onValueChange={v => form.setData('company_id', v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select company" />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map(c => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.errors.company_id && (
                            <p className="text-xs text-red-500">{form.errors.company_id}</p>
                        )}
                    </div>
                    <div className="flex-1 space-y-1">
                        <Label>Employee Type</Label>
                        <Select
                            value={form.data.employee_type}
                            onValueChange={v => form.setData('employee_type', v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="office">Office-Based</SelectItem>
                                <SelectItem value="field">Field-Based</SelectItem>
                            </SelectContent>
                        </Select>
                        {form.errors.employee_type && (
                            <p className="text-xs text-red-500">{form.errors.employee_type}</p>
                        )}
                    </div>
                    <Button type="submit" disabled={form.processing}>
                        {form.processing ? 'Adding...' : 'Add Type'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}