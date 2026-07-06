import { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import Master from "@/Layout/Master";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { BrushCleaning } from "lucide-react";
import DeleteCompanyDialog from "./component/DeleteCompanyDialog";
import CreateCompanyDialog from "./component/CreateCompanyDialog";
import EditCompanyDialog from "./component/EditCompanyDialog";
import CompanyCard from "./component/CompanyCard";

export const COMPANY_THEMES = {
    lush_fields: "bg-gradient-to-r from-[#5DA92F] to-[#9BD46A]",

    ocean_dust: "bg-gradient-to-r from-[#9BB2E5] to-[#698CBF]",

    orange_heat: "bg-gradient-to-r from-[#F64C18] to-[#EE9539]",

    void_spark: "bg-gradient-to-r from-[#000328] to-[#00458E]",

    lime_rush: "bg-gradient-to-r from-[#51C26F] to-[#F2E901]",

    frosted_light: "bg-gradient-to-r from-[#EBF4F5] to-[#B5C6E0]",
} as const;
export interface Company {
    id: number;
    name: string;
    slug: string;
    logo_path: string | null;
    status: "active" | "inactive";
    users_count: number;
    header_theme: keyof typeof COMPANY_THEMES;
}

interface Props {
    companies: Company[];
}

export default function CompaniesIndex({ companies }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [companyToDelete, setCompanyToDelete] = useState<Company | null>(
        null,
    );
    const createForm = useForm({
        name: "",
        logo_path: null as File | null,
        header_theme: "#2563eb",
    });
    const editForm = useForm({
        name: "",
        logo_path: null as File | null,
        header_theme: "#2563eb",
    });

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();

        createForm.post("/admin/companies", {
            forceFormData: true,

            onSuccess: () => {
                createForm.reset();
                createForm.clearErrors();
                setCreateOpen(false);
            },
        });
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

    function confirmDelete() {
        if (!companyToDelete) return;
        router.delete(`/admin/companies/${companyToDelete.id}`, {
            preserveScroll: true,

            onSuccess: () => {
                setCompanyToDelete(null);
            },
        });
    }
    return (
        <>
            <Master>
                {companies.length > 0 ? (
                    <>
                        <div className="flex justify-end">
                            <CreateCompanyDialog
                                open={createOpen}
                                onOpenChange={(open) => {
                                    setCreateOpen(open);

                                    if (!open) {
                                        createForm.reset();
                                        createForm.clearErrors();
                                    }
                                }}
                                form={createForm}
                                onSubmit={handleCreate}
                            />
                        </div>

                        <div className="grid lg:grid-cols-3 gap-4 mt-4">
                            {companies.map((company) => (
                                <CompanyCard
                                    key={company.id}
                                    company={company}
                                    onEdit={(company) => {
                                        setEditingCompany(company);
                                    }}
                                    onDelete={(company) => {
                                        setCompanyToDelete(company);
                                    }}
                                />
                            ))}
                        </div>

                        {/* Edit */}
                        <EditCompanyDialog
                            company={editingCompany}
                            form={editForm}
                            onSubmit={handleUpdate}
                            onClose={() => {
                                setEditingCompany(null);
                                editForm.reset();
                                editForm.clearErrors();
                            }}
                        />
                        {/* Delete */}
                        <DeleteCompanyDialog
                            company={companyToDelete}
                            onClose={() => setCompanyToDelete(null)}
                            onConfirm={confirmDelete}
                        />
                    </>
                ) : (
                    <>
                        <Empty className="h-full">
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <BrushCleaning className="" />
                                </EmptyMedia>
                                <EmptyTitle className="text-3xl">
                                    No companies found
                                </EmptyTitle>
                                <EmptyDescription>
                                    Add your first company to start setting up
                                    your workspace.
                                </EmptyDescription>
                            </EmptyHeader>
                            <EmptyContent>
                                <CreateCompanyDialog
                                    open={createOpen}
                                    onOpenChange={(open) => {
                                        setCreateOpen(open);

                                        if (!open) {
                                            createForm.reset();
                                            createForm.clearErrors();
                                        }
                                    }}
                                    form={createForm}
                                    onSubmit={handleCreate}
                                />
                            </EmptyContent>
                        </Empty>
                    </>
                )}
            </Master>
        </>
    );
}
