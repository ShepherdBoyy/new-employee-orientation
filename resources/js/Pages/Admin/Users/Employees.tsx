import { useState } from 'react'
import { useForm, router, Head } from '@inertiajs/react'
import Master from '@/Layout/Master'

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";



interface Company {
    id: number
    name: string
}

interface Employee {
    id: number
    name: string
    email: string
    status: 'active' | 'locked'
    expires_at: string | null
    acknowledgements_count: number
    company: Company | null
}

interface Props {
    employees: Employee[]
    companies: Company[]
}

export default function Employees({ employees, companies }: Props) {
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

    const createForm = useForm({ name: '', email: '', role: 'employee', company_id: '', job_title: '', field_type: '' })
    const editForm   = useForm({ name: '', email: '', company_id: '' })

    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");

    const jobs = [
        {
            label: "Graphics Artist",
            value: "ga",
        },
        {
            label: "Information Technology",
            value: "it",
        },
        {
            label: "Regulatory",
            value: "reg",
        },
        {
            label: "Sales",
            value: "sa",
        }
    ];

    function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        createForm.post('/admin/users', {
            onSuccess: () => createForm.reset(),
        })
    }

    function handleEdit(employee: Employee) {
        setEditingEmployee(employee)
        editForm.setData({
            name:       employee.name,
            email:      employee.email,
            company_id: employee.company ? String(employee.company.id) : '',
        })
    }

    function handleUpdate(e: React.FormEvent) {
        e.preventDefault()
        editForm.put(`/admin/users/${editingEmployee?.id}`, {
            onSuccess: () => setEditingEmployee(null),
        })
    }

    function handleToggleStatus(employee: Employee) {
        router.patch(`/admin/users/${employee.id}/toggle-status`)
    }

    function handleResetPassword(employee: Employee) {
        if (confirm(`Send password reset link to ${employee.email}?`)) {
            router.post(`/admin/users/${employee.id}/reset-password`)
        }
    }

    function handleDelete(employee: Employee) {
        if (confirm(`Delete ${employee.name}? This cannot be undone.`)) {
            router.delete(`/admin/users/${employee.id}`)
        }
    }

    return (
        <>
            <Head title="Employees" />

            <Master>

                <div className="max-w-6xl mx-auto p-8 space-y-8">
                    <h1 className="text-2xl font-semibold text-gray-800">Employees</h1>

                    {/* Create Form */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-base font-medium text-gray-700 mb-4">Add New Employee</h2>
                        <form onSubmit={handleCreate} className="grid grid-cols-3 gap-3 items-end">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Name</label>
                                <Input
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={e => createForm.setData('name', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    placeholder="Juan dela Cruz"
                                />
                                {createForm.errors.name && <p className="text-red-500 text-xs mt-1">{createForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Email</label>
                                <Input
                                    type="email"
                                    value={createForm.data.email}
                                    onChange={e => createForm.setData('email', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    placeholder="employee@company.com"
                                />
                                {createForm.errors.email && <p className="text-red-500 text-xs mt-1">{createForm.errors.email}</p>}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Company</label>
                                <Select value={createForm.data.company_id} onValueChange={value => createForm.setData('company_id', value)}>
                                    <SelectTrigger className="w-full max-w-48">
                                    <SelectValue placeholder="Select a company" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectGroup>
                                            {companies.map((c) => (
                                                // Ensure value is cast to a string for Shadcn compatibility
                                                <SelectItem key={c.id} value={String(c.id)}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {createForm.errors.company_id && <p className="text-red-500 text-xs mt-1">{createForm.errors.company_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Job Title</label>
                                <Popover onOpenChange={setOpen} open={open}>
                                    <PopoverTrigger asChild>
                                    <Button
                                        aria-expanded={open}
                                        className="w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]"
                                        role="combobox"
                                        variant="outline"
                                    >
                                        <span className={cn("truncate", !value && "text-muted-foreground")}>
                                        {value
                                            ? jobs.find((jobs) => jobs.value === value)
                                                ?.label
                                            : "Select job title"}
                                        </span>
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                    align="start"
                                    className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
                                    >
                                    <Command>
                                        <CommandInput placeholder="Search job title..." />
                                        <CommandList>
                                        <CommandEmpty>No job title found.</CommandEmpty>
                                        <CommandGroup>
                                            {jobs.map((jobs) => (
                                            <CommandItem
                                                key={jobs.value}
                                                onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : currentValue);
                                                setOpen(false);
                                                }}
                                                value={jobs.value}
                                            >
                                                {jobs.label}
                                            </CommandItem>
                                            ))}
                                        </CommandGroup>
                                        </CommandList>
                                    </Command>
                                    </PopoverContent>
                                </Popover>
                                {createForm.errors.job_title && <p className="text-red-500 text-xs mt-1">{createForm.errors.job_title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Field Type</label>
                                <Select>
                                    <SelectTrigger className="w-full max-w-48">
                                        <SelectValue placeholder="Select employee field" />
                                    </SelectTrigger>
                                    <SelectContent position="popper">
                                        <SelectGroup>
                                            <SelectItem value="1">Field Base</SelectItem>
                                            <SelectItem value="2">Non Field Base</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {createForm.errors.field_type && <p className="text-red-500 text-xs mt-1">{createForm.errors.field_type}</p>}
                            </div>
                            <div className="col-span-3 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
                                >
                                    {createForm.processing ? 'Creating...' : 'Create Employee'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 text-left">Name</th>
                                    <th className="px-6 py-3 text-left">Company</th>
                                    <th className="px-6 py-3 text-left">Progress</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-left">Expires</th>
                                    <th className="px-6 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {employees.map(employee => (
                                    <tr key={employee.id}>
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-800">{employee.name}</p>
                                            <p className="text-xs text-gray-400">{employee.email}</p>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {employee.company?.name ?? '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-gray-500">
                                                {employee.acknowledgements_count} slides acknowledged
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                employee.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {employee.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-400">
                                            {employee.expires_at
                                                ? new Date(employee.expires_at).toLocaleString()
                                                : '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2 flex-wrap">
                                                <button onClick={() => handleEdit(employee)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                                <button onClick={() => handleToggleStatus(employee)} className="text-yellow-600 hover:underline text-xs">
                                                    {employee.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button onClick={() => handleResetPassword(employee)} className="text-indigo-600 hover:underline text-xs">Reset PW</button>
                                                <button onClick={() => handleDelete(employee)} className="text-red-600 hover:underline text-xs">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {employees.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-400">No employees yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit Modal */}
                {editingEmployee && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                            <h2 className="text-base font-medium text-gray-700 mb-4">Edit Employee</h2>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={editForm.data.name}
                                        onChange={e => editForm.setData('name', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    />
                                    {editForm.errors.name && <p className="text-red-500 text-xs mt-1">{editForm.errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editForm.data.email}
                                        onChange={e => editForm.setData('email', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    />
                                    {editForm.errors.email && <p className="text-red-500 text-xs mt-1">{editForm.errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Company</label>
                                    <select
                                        value={editForm.data.company_id}
                                        onChange={e => editForm.setData('company_id', e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    >
                                        <option value="">Select company</option>
                                        {companies.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    {editForm.errors.company_id && <p className="text-red-500 text-xs mt-1">{editForm.errors.company_id}</p>}
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button type="button" onClick={() => setEditingEmployee(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
                                    <button type="submit" disabled={editForm.processing} className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50">
                                        {editForm.processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </Master>
        </>
    )
}