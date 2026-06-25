import { useState } from "react";
import { useForm, router, Head } from "@inertiajs/react";
import Master from "@/Pages/Layout/Master";
interface Company {
    id: number;
    name: string;
    slug: string;
    logo_path: string | null;
    status: "active" | "inactive";
    users_count: number;
}

interface Props {
    companies: Company[];
}

export default function CompaniesIndex({ companies }: Props) {
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);

    const createForm = useForm({ name: "", logo_path: null as File | null });
    const editForm = useForm({ name: "", logo_path: null as File | null });

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        createForm.post("/admin/companies", {
            onSuccess: () => createForm.reset(),
        });
    }

    function handleEdit(company: Company) {
        setEditingCompany(company);
        editForm.setData({ name: company.name, logo_path: null });
    }

    function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        editForm.put(`/admin/companies/${editingCompany?.id}`, {
            onSuccess: () => setEditingCompany(null),
        });
    }

    function handleToggleStatus(company: Company) {
        router.patch(`/admin/companies/${company.id}/toggle-status`);
    }

    function handleDelete(company: Company) {
        if (confirm(`Delete ${company.name}? This cannot be undone.`)) {
            router.delete(`/admin/companies/${company.id}`);
        }
    }

    return (
        <>
            <Head title="Companies" />
            <Master>
                <div className="max-w-5xl mx-auto p-8 space-y-8">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Companies
                    </h1>

                    {/* Create Form */}
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-base font-medium text-gray-700 mb-4">
                            Add New Company
                        </h2>
                        <form
                            onSubmit={handleCreate}
                            className="flex gap-3 items-end"
                        >
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={(e) =>
                                        createForm.setData(
                                            "name",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    placeholder="Acme Corporation"
                                />
                                {createForm.errors.name && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {createForm.errors.name}
                                    </p>
                                )}
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">
                                    Logo (optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        createForm.setData(
                                            "logo_path",
                                            e.target.files?.[0] ?? null,
                                        )
                                    }
                                    className="w-full text-sm text-gray-500"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={createForm.processing}
                                className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
                            >
                                {createForm.processing
                                    ? "Creating..."
                                    : "Create"}
                            </button>
                        </form>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3 text-left">
                                        Company
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Users
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {companies.map((company) => (
                                    <tr key={company.id}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {company.logo_path && (
                                                    <img
                                                        src={`/storage/${company.logo_path}`}
                                                        alt={company.name}
                                                        className="w-8 h-8 rounded-full object-cover"
                                                    />
                                                )}
                                                <span className="font-medium text-gray-800">
                                                    {company.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {company.users_count}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    company.status === "active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-100 text-gray-500"
                                                }`}
                                            >
                                                {company.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(company)
                                                    }
                                                    className="text-blue-600 hover:underline text-xs"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            company,
                                                        )
                                                    }
                                                    className="text-yellow-600 hover:underline text-xs"
                                                >
                                                    {company.status === "active"
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(company)
                                                    }
                                                    className="text-red-600 hover:underline text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {companies.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-6 py-8 text-center text-gray-400"
                                        >
                                            No companies yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit Modal */}
                {editingCompany && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                            <h2 className="text-base font-medium text-gray-700 mb-4">
                                Edit Company
                            </h2>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.data.name}
                                        onChange={(e) =>
                                            editForm.setData(
                                                "name",
                                                e.target.value,
                                            )
                                        }
                                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    />
                                    {editForm.errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {editForm.errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">
                                        Logo (optional)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            editForm.setData(
                                                "logo_path",
                                                e.target.files?.[0] ?? null,
                                            )
                                        }
                                        className="w-full text-sm text-gray-500"
                                    />
                                </div>
                                <div className="flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setEditingCompany(null)}
                                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editForm.processing}
                                        className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50"
                                    >
                                        {editForm.processing
                                            ? "Saving..."
                                            : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </Master>
        </>
    );
}
