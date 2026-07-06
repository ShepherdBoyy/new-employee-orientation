import { useState } from 'react'
import { Head } from '@inertiajs/react'
import AddEmployeeTypeForm from './components/AddEmployeeTypeForm'
import AddJobPositionForm from './components/AddJobPositionForm'
import CompanyPositionsCard from './components/CompanyPositionsCard'
import EditJobPositionDialog from './components/EditJobPositionDialog'
import Master from '@/Layout/Master'

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
    companies: CompanyWithData[]
}

export default function JobPositionsIndex({ companies }: Props) {
    const [editingPosition, setEditingPosition] = useState<JobPosition | null>(null)

    return (
        <>
            <Head title="Job Positions" />
            
            <Master>
                <div className="space-y-6">
                    <AddEmployeeTypeForm companies={companies} />
                    <AddJobPositionForm companies={companies} />

                    <div className="space-y-4">
                        {companies.map(company => (
                            <CompanyPositionsCard
                                key={company.id}
                                company={company}
                                onEditPosition={setEditingPosition}
                            />
                        ))}
                        {companies.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-8">
                                No companies found. Create a company first.
                            </p>
                        )}
                    </div>
                </div>
            </Master>

            <EditJobPositionDialog
                position={editingPosition}
                onClose={() => setEditingPosition(null)}
            />
        </>
    )
}