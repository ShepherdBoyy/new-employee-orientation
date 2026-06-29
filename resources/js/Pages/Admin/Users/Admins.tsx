import { useState } from 'react'
import { useForm, router, Head } from '@inertiajs/react'
import Master from '@/Layout/Master'

interface Company {
    id: number
    name: string
}

interface Admin {
    id: number
    name: string
    email: string
    status: 'active' | 'locked'
}

interface Props {
    admins: Admin[]
    companies: Company[]
}

export default function Admins({ admins, companies }: Props) {
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)

    const createForm = useForm({ name: '', email: '', role: 'admin', company_id: '' })
    const editForm   = useForm({ name: '', email: '' })

    function handleCreate(e: React.FormEvent) {
        e.preventDefault()
        createForm.post('/admin/users', {
            onSuccess: () => createForm.reset(),
        })
    }

    function handleEdit(admin: Admin) {
        setEditingAdmin(admin)
        editForm.setData({ name: admin.name, email: admin.email })
    }

    function handleUpdate(e: React.FormEvent) {
        e.preventDefault()
        editForm.put(`/admin/users/${editingAdmin?.id}`, {
            onSuccess: () => setEditingAdmin(null),
        })
    }

    function handleToggleStatus(admin: Admin) {
        router.patch(`/admin/users/${admin.id}/toggle-status`)
    }

    function handleResetPassword(admin: Admin) {
        if (confirm(`Send password reset link to ${admin.email}?`)) {
            router.post(`/admin/users/${admin.id}/reset-password`)
        }
    }

    function handleDelete(admin: Admin) {
        if (confirm(`Delete ${admin.name}? This cannot be undone.`)) {
            router.delete(`/admin/users/${admin.id}`)
        }
    }

    return (
        <>
            <Head title="Admins" />

            <Master>

                <div className="max-w-5xl mx-auto p-8 space-y-8">
                    <h1 className="text-2xl font-semibold text-gray-800">Admins</h1>

                    {/* Create Form */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-base font-medium text-gray-700 mb-4">Add New Admin</h2>
                        <form onSubmit={handleCreate} className="grid grid-cols-2 gap-3 items-end">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Name</label>
                                <input
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
                                <input
                                    type="email"
                                    value={createForm.data.email}
                                    onChange={e => createForm.setData('email', e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    placeholder="admin@company.com"
                                />
                                {createForm.errors.email && <p className="text-red-500 text-xs mt-1">{createForm.errors.email}</p>}
                            </div>
                            <div className="col-span-2 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={createForm.processing}
                                    className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
                                >
                                    {createForm.processing ? 'Creating...' : 'Create Admin'}
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
                                    <th className="px-6 py-3 text-left">Email</th>
                                    <th className="px-6 py-3 text-left">Status</th>
                                    <th className="px-6 py-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {admins.map(admin => (
                                    <tr key={admin.id}>
                                        <td className="px-6 py-4 font-medium text-gray-800">{admin.name}</td>
                                        <td className="px-6 py-4 text-gray-500">{admin.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                admin.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-500'
                                            }`}>
                                                {admin.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleEdit(admin)} className="text-blue-600 hover:underline text-xs">Edit</button>
                                                <button onClick={() => handleToggleStatus(admin)} className="text-yellow-600 hover:underline text-xs">
                                                    {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button onClick={() => handleResetPassword(admin)} className="text-indigo-600 hover:underline text-xs">Reset PW</button>
                                                <button onClick={() => handleDelete(admin)} className="text-red-600 hover:underline text-xs">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {admins.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No admins yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit Modal */}
                {editingAdmin && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                            <h2 className="text-base font-medium text-gray-700 mb-4">Edit Admin</h2>
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
                                <div className="flex gap-3 justify-end">
                                    <button type="button" onClick={() => setEditingAdmin(null)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
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