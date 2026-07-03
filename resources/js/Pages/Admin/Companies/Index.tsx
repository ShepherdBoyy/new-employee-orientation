import { useState } from "react";
import { useForm, router } from "@inertiajs/react";
import Master from "@/Layout/Master";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogDescription,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogMedia,
} from "@/components/ui/alert-dialog";

import { Trash2Icon } from "lucide-react";
import CompanyCard from "./component/CompanyCard";
export interface Company {
    id: number;
    name: string;
    slug: string;
    logo_path: string | null;
    status: "active" | "inactive";
    users_count: number;
    header_color: string;
}

interface Props {
    companies: Company[];
}

export default function CompaniesIndex({ companies }: Props) {
    const COMPANY_COLORS = [
        "#2563eb", // blue
        "#059669", // emerald
        "#dc2626", // red
        "#7c3aed", // violet
        "#ea580c", // orange
        "#0891b2", // cyan
    ];
    const [editingCompany, setEditingCompany] = useState<Company | null>(null);
    const [companyToDelete, setCompanyToDelete] = useState<Company | null>(
        null,
    );
    const createForm = useForm({
        name: "",
        logo_path: null as File | null,
        header_color: "#2563eb",
    });
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
        router.delete(`/admin/companies/${company.id}`);
    }

    return (
        <>
            <Master>
                <div className="flex justify-end">
                    <Dialog>
                        <DialogTrigger asChild className="">
                            <Button size="lg">
                                New Company <Plus absoluteStrokeWidth />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <FieldSet className="">
                                <FieldLegend>New Company</FieldLegend>
                                <FieldDescription>
                                    Provide the basic details of your company.
                                </FieldDescription>
                                <form
                                    onSubmit={handleCreate}
                                    className="space-y-4"
                                >
                                    <FieldGroup>
                                        <Field>
                                            <FieldLabel htmlFor="name">
                                                Company Name
                                            </FieldLabel>
                                            <Input
                                                value={createForm.data.name}
                                                className=""
                                                autoComplete="off"
                                                onChange={(e) =>
                                                    createForm.setData(
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Progressive Medical Corporation"
                                            />
                                            <FieldDescription>
                                                Enter the official name of your
                                                company.
                                            </FieldDescription>
                                            {createForm.errors.name && (
                                                <FieldError>
                                                    {createForm.errors.name}
                                                </FieldError>
                                            )}
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="username">
                                                Company Logo
                                            </FieldLabel>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    createForm.setData(
                                                        "logo_path",
                                                        e.target.files?.[0] ??
                                                            null,
                                                    )
                                                }
                                                className=""
                                            />
                                        </Field>
                                        <Field className="space-y-2">
                                            <FieldLabel>
                                                Header Color
                                            </FieldLabel>

                                            <div className="flex gap-3">
                                                {COMPANY_COLORS.map((color) => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        onClick={() =>
                                                            createForm.setData(
                                                                "header_color",
                                                                color,
                                                            )
                                                        }
                                                        className={`
                                                            h-10
                                                            w-10
                                                            rounded-full
                                                            border-2
                                                            transition
                                                            ${
                                                                createForm.data
                                                                    .header_color ===
                                                                color
                                                                    ? "border-black/30 scale-110"
                                                                    : "border-transparent"
                                                            }
                                                        `}
                                                        style={{
                                                            backgroundColor:
                                                                color,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <FieldDescription>
                                                Choose a distinct color for your
                                                company
                                            </FieldDescription>
                                        </Field>
                                    </FieldGroup>

                                    <Field
                                        orientation="horizontal"
                                        className="justify-end"
                                    >
                                        <Button
                                            size="lg"
                                            variant="outline"
                                            type="button"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="lg"
                                            type="submit"
                                            disabled={createForm.processing}
                                        >
                                            {createForm.processing
                                                ? "Creating"
                                                : "Submit"}
                                        </Button>
                                    </Field>
                                </form>
                            </FieldSet>
                        </DialogContent>
                    </Dialog>
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
                <Dialog
                    open={!!editingCompany}
                    onOpenChange={(open) => {
                        if (!open) setEditingCompany(null);
                        editForm.reset();
                    }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Company</DialogTitle>
                            <DialogDescription>
                                Update company information.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <p>Company Name</p>

                                <Input
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData("name", e.target.value)
                                    }
                                />

                                {editForm.errors.name && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <p className="font-medium">Company Logo</p>

                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex gap-2 items-center">
                                        <img
                                            src={
                                                editForm.data.logo_path
                                                    ? URL.createObjectURL(
                                                          editForm.data
                                                              .logo_path,
                                                      )
                                                    : `/storage/${editingCompany?.logo_path}`
                                            }
                                            className="h-12 w-12 rounded-full border p-1 object-cover"
                                        />
                                        {editForm.data.logo_path && (
                                            <p className="text-sm text-muted-foreground">
                                                {editForm.data.logo_path.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2 flex justify-end">
                                        <Input
                                            id="logo"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                editForm.setData(
                                                    "logo_path",
                                                    e.target.files?.[0] ?? null,
                                                )
                                            }
                                        />

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                document
                                                    .getElementById("logo")
                                                    ?.click()
                                            }
                                        >
                                            Change Logo
                                        </Button>
                                    </div>
                                </div>

                                {editForm.errors.logo_path && (
                                    <p className="text-sm text-destructive">
                                        {editForm.errors.logo_path}
                                    </p>
                                )}
                            </div>

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={editForm.processing}
                                >
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
                {/* Delete */}
                <AlertDialog
                    open={!!companyToDelete}
                    onOpenChange={(open) => {
                        if (!open) setCompanyToDelete(null);
                    }}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                <Trash2Icon />
                            </AlertDialogMedia>
                            <AlertDialogTitle>Delete Company</AlertDialogTitle>

                            <AlertDialogDescription>
                                Are you sure you want to delete
                                <strong> {companyToDelete?.name}</strong>? This
                                action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            <AlertDialogAction
                                variant="destructive"
                                onClick={() => {
                                    if (companyToDelete) {
                                        handleDelete(companyToDelete);
                                    }
                                }}
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Master>
        </>
    );
}
