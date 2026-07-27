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
import { Separator } from "@/components/ui/separator";
import type { CompanyWithJobCount } from "../Types/company";
import { toast } from "sonner";
interface Props {
    companies: CompanyWithJobCount[];
}

export default function CompaniesIndex({ companies }: Props) {
    const [createOpen, setCreateOpen] = useState(false);
    const [editingCompany, setEditingCompany] =
        useState<CompanyWithJobCount | null>(null);
    const [companyToDelete, setCompanyToDelete] =
        useState<CompanyWithJobCount | null>(null);
    const createForm = useForm({
        name: "",
        logo_path: null as File | null,
        header_theme: null,
    });
    const editForm = useForm({
        name: "",
        logo_path: null as File | null,
        header_theme: null,
    });

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();

        createForm.post("/admin/companies", {
            forceFormData: true,

            onSuccess: (message) => {
                createForm.reset();
                createForm.clearErrors();
                setCreateOpen(false);
                toast.success(message.props.success, {
                    position: "top-center",
                });
            },
        });
    }

    function handleUpdate(e: React.FormEvent) {
        e.preventDefault();
        editForm.put(`/admin/companies/${editingCompany?.id}`, {
            onSuccess: (message) => {
                setEditingCompany(null);
                toast.success(message.props.success, {
                    position: "top-center",
                });
            },
        });
    }

    function handleToggleStatus(company: CompanyWithJobCount) {
        router.patch(`/admin/companies/${company.id}/toggle-status`);
    }

    function confirmDelete() {
        if (!companyToDelete) return;
        router.delete(`/admin/companies/${companyToDelete.id}`, {
            preserveScroll: true,

            onSuccess: (message) => {
                setCompanyToDelete(null);
                toast.success(message.props.success, {
                    position: "top-center",
                });
            },
        });
    }
    return (
        <>
            <Master>
                {companies.length > 0 ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Company
                                </h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Reusable roles that can later be assigned to
                                    one or more companies.
                                </p>
                            </div>
                        </div>
                        <Separator />
                        <div className="">
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
                                onClose={() => setCreateOpen(false)}
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
                    </div>
                ) : (
                    <Empty className="h-full">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <BrushCleaning className="" />
                            </EmptyMedia>
                            <EmptyTitle className="text-2xl">
                                No companies found
                            </EmptyTitle>
                            <EmptyDescription>
                                Add your first company to start setting up your
                                workspace.
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
                )}
            </Master>
        </>
    );
}
