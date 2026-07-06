import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

interface CompanyWithTypes extends Company {
    employee_types: { id: number; employee_type: 'office' | 'field' }[]
}

interface Props {
    companies: CompanyWithTypes[]
}

export default function AddJobPositionForm({ companies }: Props) {
    const form = useForm({
        company_id:    '',
        employee_type: '',
        name:          '',
    })

    const selectedCompany = companies.find(c => String(c.id) === form.data.company_id)
    const availableTypes  = selectedCompany?.employee_types ?? []

    function handleCompanyChange(value: string) {
        form.setData({
            company_id:    value,
            employee_type: '',
            name:          '',
        })
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        form.post('/admin/job-positions', {
            onSuccess: () => form.reset(),
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Add Job Position</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-3 items-end">
                    <div className="space-y-1">
                        <Label>Company</Label>
                        <Select
                            value={form.data.company_id}
                            onValueChange={handleCompanyChange}
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
                    <div className="space-y-1">
                        <Label>Employee Type</Label>
                        <Select
                            value={form.data.employee_type}
                            onValueChange={v => form.setData('employee_type', v)}
                            disabled={availableTypes.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableTypes.map(t => (
                                    <SelectItem key={t.id} value={t.employee_type}>
                                        {t.employee_type === 'office'
                                            ? 'Office-Based'
                                            : 'Field-Based'}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.errors.employee_type && (
                            <p className="text-xs text-red-500">{form.errors.employee_type}</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <Label>Position Name</Label>
                        <Input
                            value={form.data.name}
                            onChange={e => form.setData('name', e.target.value)}
                            placeholder="e.g. Software Engineer"
                            disabled={! form.data.employee_type}
                        />
                        {form.errors.name && (
                            <p className="text-xs text-red-500">{form.errors.name}</p>
                        )}
                    </div>
                    <Button type="submit" disabled={form.processing}>
                        {form.processing ? 'Adding...' : 'Add Position'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}