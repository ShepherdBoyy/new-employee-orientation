import { Link } from '@inertiajs/react'
import { ArrowLeft, Users } from 'lucide-react'
import JobPositionListItem, { type PickerPosition } from "./components/JobPositionListItem"
import Master from '@/Layout/Master'

interface CompanyType {
    id: number
    name: string
    slug: string
}

interface Props {
    company: CompanyType
    positions: PickerPosition[]
}

export default function JobPositionPicker({ company, positions }: Props) {
    return (
        <Master>
            <div className="mx-auto w-full space-y-6 p-6 lg:p-8">
                <Link
                    href={`/admin/folders/${company.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to {company.name}
                </Link>

                <div className="border-b pb-5">
                    <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                        <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        Module 5 — Job-Specific Training
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Select a job position to manage its specific training content.
                    </p>
                </div>

                {positions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">No job positions yet</p>
                            <p className="text-xs text-muted-foreground">
                                Add job positions to this company first.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {positions.map(position => (
                            <JobPositionListItem key={position.id} companyId={company.id} position={position} />
                        ))}
                    </div>
                )}
            </div>
        </Master>
    )
}