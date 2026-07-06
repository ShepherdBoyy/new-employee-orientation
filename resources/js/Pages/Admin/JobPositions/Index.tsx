import { useState } from 'react'
import { useForm, router, Head } from '@inertiajs/react'

interface EmployeeType {
    id: number
    employee_type: 'office' | 'field'
}

interface JobPosition {
    id: number
    name: string
    employee_type: 'office' | 'field'
    company_id: number
}

interface Company {
    id: number
    name: string
    employee_types: EmployeeType[]
    job_positions: JobPosition[]
}

interface Props {
    companies: Company[]
}

export default function JobPositionsIndex({ companies }: Props) {
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
    const [editingPosition, setEditingPosition] = useState<JobPosition | null>(null)

    const typeForm = useForm({
        company_id:    '',
        employee_type: '' as 'office' | 'field' | '',
    })

    const positionForm = useForm({
        company_id:    '',
        employee_type: '' as 'office' | 'field' | '',
        name:          '',
    })

    const editForm = useForm({ name: '' })

    function handleSelectCompany(company: Company) {
        setSelectedCompany(company)
        typeForm.setData('company_id', String(company.id))
        positionForm.setData('company_id', String(company.id))
    }

    function handleAddType(e: React.FormEvent) {
        e.preventDefault()
        typeForm.post('/admin/employee-types', {
            onSuccess: () => typeForm.reset('employee_type'),
        })
    }

    function handleRemoveType(type: EmployeeType) {
        if (confirm(`Remove ${type.employee_type}-based type from this company?`)) {
            router.delete(`/admin/employee-types/${type.id}`)
        }
    }

    function handleAddPosition(e: React.FormEvent) {
        e.preventDefault()
        positionForm.post('/admin/job-positions', {
            onSuccess: () => positionForm.reset('name'),
        })
    }

    function handleEditPosition(position: JobPosition) {
        setEditingPosition(position)
        editForm.setData('name', position.name)
    }

    function handleUpdatePosition(e: React.FormEvent) {
        e.preventDefault()
        editForm.put(`/admin/job-positions/${editingPosition?.id}`, {
            onSuccess: () => setEditingPosition(null),
        })
    }

    function handleDeletePosition(position: JobPosition) {
        if (confirm(`Delete "${position.name}"? This cannot be undone.`)) {
            router.delete(`/admin/job-positions/${position.id}`)
        }
    }

    const officeTypes = selectedCompany?.employee_types.filter(t => t.employee_type === 'office') ?? []
    const fieldTypes  = selectedCompany?.employee_types.filter(t => t.employee_type === 'field') ?? []
    const hasOffice   = officeTypes.length > 0
    const hasField    = fieldTypes.length > 0

    const officePositions = selectedCompany?.job_positions.filter(p => p.employee_type === 'office') ?? []
    const fieldPositions  = selectedCompany?.job_positions.filter(p => p.employee_type === 'field') ?? []

    return (
        <>
            <Head title="Job Positions" />
            <div className="max-w-6xl mx-auto p-8 space-y-8">
                <h1 className="text-2xl font-semibold text-gray-800">Job Positions</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Company List */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-700">Companies</p>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {companies.map(company => (
                                <button
                                    key={company.id}
                                    onClick={() => handleSelectCompany(company)}
                                    className={`w-full text-left px-4 py-3 text-sm transition ${
                                        selectedCompany?.id === company.id
                                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {company.name}
                                </button>
                            ))}
                            {companies.length === 0 && (
                                <p className="px-4 py-6 text-sm text-gray-400 text-center">
                                    No companies yet.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Panel */}
                    {selectedCompany ? (
                        <div className="lg:col-span-2 space-y-6">

                            {/* Employee Types */}
                            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                                <h2 className="text-base font-medium text-gray-700">
                                    Employee Types for {selectedCompany.name}
                                </h2>
                                <div className="flex gap-3">
                                    {(['office', 'field'] as const).map(type => {
                                        const exists = selectedCompany.employee_types
                                            .some(t => t.employee_type === type)
                                        const record = selectedCompany.employee_types
                                            .find(t => t.employee_type === type)
                                        return (
                                            <div
                                                key={type}
                                                className={`flex-1 rounded-xl border-2 p-4 flex items-center justify-between ${
                                                    exists
                                                        ? 'border-indigo-200 bg-indigo-50'
                                                        : 'border-gray-200 bg-gray-50'
                                                }`}
                                            >
                                                <div>
                                                    <p className={`text-sm font-medium ${exists ? 'text-indigo-700' : 'text-gray-500'}`}>
                                                        {type === 'office' ? 'Office-based' : 'Field-based'}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {exists ? 'Enabled' : 'Not configured'}
                                                    </p>
                                                </div>
                                                {exists ? (
                                                    <button
                                                        onClick={() => handleRemoveType(record!)}
                                                        className="text-xs text-red-500 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            typeForm.setData({
                                                                company_id:    String(selectedCompany.id),
                                                                employee_type: type,
                                                            })
                                                            typeForm.post('/admin/employee-types')
                                                        }}
                                                        className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                                    >
                                                        Enable
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                                {typeForm.errors.employee_type && (
                                    <p className="text-red-500 text-xs">{typeForm.errors.employee_type}</p>
                                )}
                            </div>

                            {/* Add Position Form */}
                            {(hasOffice || hasField) && (
                                <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
                                    <h2 className="text-base font-medium text-gray-700">
                                        Add Job Position
                                    </h2>
                                    <form onSubmit={handleAddPosition} className="grid grid-cols-3 gap-3 items-end">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Type</label>
                                            <select
                                                value={positionForm.data.employee_type}
                                                onChange={e => positionForm.setData('employee_type', e.target.value as 'office' | 'field')}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                                            >
                                                <option value="">Select type</option>
                                                {hasOffice && <option value="office">Office-based</option>}
                                                {hasField && <option value="field">Field-based</option>}
                                            </select>
                                            {positionForm.errors.employee_type && (
                                                <p className="text-red-500 text-xs mt-1">{positionForm.errors.employee_type}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1">Position Name</label>
                                            <input
                                                type="text"
                                                value={positionForm.data.name}
                                                onChange={e => positionForm.setData('name', e.target.value)}
                                                className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                                                placeholder="e.g. Software Engineer"
                                            />
                                            {positionForm.errors.name && (
                                                <p className="text-red-500 text-xs mt-1">{positionForm.errors.name}</p>
                                            )}
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={positionForm.processing}
                                            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
                                        >
                                            {positionForm.processing ? 'Adding...' : 'Add Position'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Positions List */}
                            {(hasOffice || hasField) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {hasOffice && (
                                        <PositionList
                                            title="Office-based"
                                            positions={officePositions}
                                            onEdit={handleEditPosition}
                                            onDelete={handleDeletePosition}
                                        />
                                    )}
                                    {hasField && (
                                        <PositionList
                                            title="Field-based"
                                            positions={fieldPositions}
                                            onEdit={handleEditPosition}
                                            onDelete={handleDeletePosition}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-12 flex items-center justify-center text-gray-400 text-sm">
                            Select a company to manage its employee types and job positions.
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {editingPosition && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
                        <h2 className="text-base font-medium text-gray-700 mb-4">
                            Edit Position
                        </h2>
                        <form onSubmit={handleUpdatePosition} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Position Name</label>
                                <input
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={e => editForm.setData('name', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                                />
                                {editForm.errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{editForm.errors.name}</p>
                                )}
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setEditingPosition(null)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

function PositionList({
    title,
    positions,
    onEdit,
    onDelete,
}: {
    title: string
    positions: JobPosition[]
    onEdit: (p: JobPosition) => void
    onDelete: (p: JobPosition) => void
}) {
    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-700">{title}</p>
            </div>
            <div className="divide-y divide-gray-50">
                {positions.map(position => (
                    <div key={position.id} className="px-4 py-3 flex items-center justify-between">
                        <p className="text-sm text-gray-700">{position.name}</p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(position)}
                                className="text-blue-600 hover:underline text-xs"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(position)}
                                className="text-red-500 hover:underline text-xs"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                {positions.length === 0 && (
                    <p className="px-4 py-6 text-sm text-gray-400 text-center">
                        No positions yet.
                    </p>
                )}
            </div>
        </div>
    )
}