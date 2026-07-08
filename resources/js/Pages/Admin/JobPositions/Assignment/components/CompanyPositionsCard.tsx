import { router } from '@inertiajs/react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { X } from 'lucide-react'
import PositionGroup from './PositionGroup'

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
    company_id: number
    employee_type: 'office' | 'field'
    name: string
}

interface CompanyEmployeeType {
    id: number
    company_id: number
    employee_type: 'office' | 'field'
}

interface CompanyWithData extends Company {
    employee_types: CompanyEmployeeType[]
    job_positions: JobPosition[]
}

interface Props {
    company: CompanyWithData
    onEditPosition: (position: JobPosition) => void
}

export default function CompanyPositionsCard({ company, onEditPosition }: Props) {
    function handleDeleteType(type: CompanyEmployeeType) {
        if (confirm(`Remove ${type.employee_type}-based type from ${company.name}?`)) {
            router.delete(`/admin/employee-types/${type.id}`)
        }
    }

    function handleDeletePosition(position: JobPosition) {
        if (confirm(`Delete position "${position.name}"? This cannot be undone.`)) {
            router.delete(`/admin/job-positions/${position.id}`)
        }
    }

    const officePositions = company.job_positions.filter(
        p => p.employee_type === 'office'
    )

    const fieldPositions = company.job_positions.filter(
        p => p.employee_type === 'field'
    )

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{company.name}</CardTitle>
                    <div className="flex gap-1">
                        {company.employee_types.map(type => (
                            <Badge
                                key={type.id}
                                variant="secondary"
                                className="gap-1 pr-1"
                            >
                                {type.employee_type === 'office'
                                    ? 'Office-Based'
                                    : 'Field-Based'}
                                <button
                                    onClick={() => handleDeleteType(type)}
                                    className="hover:text-red-500 transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {company.employee_types.length === 0 && (
                    <p className="text-sm text-slate-400">
                        No employee types configured yet.
                    </p>
                )}

                {officePositions.length > 0 && (
                    <PositionGroup
                        label="Office-Based"
                        positions={officePositions}
                        onEdit={onEditPosition}
                        onDelete={handleDeletePosition}
                    />
                )}

                {officePositions.length > 0 && fieldPositions.length > 0 && (
                    <Separator />
                )}

                {fieldPositions.length > 0 && (
                    <PositionGroup
                        label="Field-Based"
                        positions={fieldPositions}
                        onEdit={onEditPosition}
                        onDelete={handleDeletePosition}
                    />
                )}

                {company.employee_types.length > 0 &&
                    officePositions.length === 0 &&
                    fieldPositions.length === 0 && (
                        <p className="text-sm text-slate-400">
                            No positions added yet.
                        </p>
                    )}
            </CardContent>
        </Card>
    )
}