import { Button } from '@/components/ui/button'

interface JobPosition {
    id: number
    company_id: number
    employee_type: 'office' | 'field'
    name: string
}

interface Props {
    label: string
    positions: JobPosition[]
    onEdit: (position: JobPosition) => void
    onDelete: (position: JobPosition) => void
}

export default function PositionGroup({ label, positions, onEdit, onDelete }: Props) {
    return (
        <div className="space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {label}
            </p>
            <div className="space-y-1">
                {positions.map(position => (
                    <div
                        key={position.id}
                        className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                        <span className="text-sm text-slate-700">
                            {position.name}
                        </span>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => onEdit(position)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-red-500 hover:text-red-700"
                                onClick={() => onDelete(position)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}