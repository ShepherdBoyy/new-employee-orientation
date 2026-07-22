import { useEffect, useMemo, useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { Plus, Pencil, Trash2, Users2, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
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
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import EmployeeDetailDialog, {
    type Employee as EmployeeDetail,
} from "./components/EmployeeDetailDialog";
import Master from "@/Layout/Master";
import type { JobPosition } from "../Types/job-position";
import type { CompanyWithJobs } from "../Types/company";

interface Employee {
    id: number;
    name: string;
    email: string;
    expires_at: string | null;
    company: { id: number; name: string; logo_path: string } | null;
    job_position: JobPosition | null;
    total_folders: number;
    completed_folders: number;
    status: "not_started" | "in_progress" | "acknowledged";
}

interface Props {
    employees: Employee[];
    companies: CompanyWithJobs[];
}

const statusMap = {
    not_started: {
        label: "Not Started",
        className: "bg-muted text-muted-foreground",
    },
    in_progress: {
        label: "Ongoing",
        className:
            "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    },
    acknowledged: {
        label: "Acknowledged",
        className:
            "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    },
};

export default function Employees({
    employees: initialEmployees,
    companies,
}: Props) {
    const [employees, setEmployees] = useState(initialEmployees);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(
        null,
    );
    const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
        null,
    );
    const [viewingEmployee, setViewingEmployee] =
        useState<EmployeeDetail | null>(null);

    useEffect(() => setEmployees(initialEmployees), [initialEmployees]);

    console.log(companies);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
        email: "",
        role: "employee",
        company_id: "",
        job_position_id: "",
    });

    const availablePositions = useMemo(() => {
        const company = companies.find((c) => String(c.id) === data.company_id);
        return company?.jobs ?? [];
    }, [data.company_id, companies]);

    function openCreate() {
        setEditingEmployee(null);
        reset();
        setData("role", "employee");
        setDialogOpen(true);
    }

    function openEdit(employee: Employee, e: React.MouseEvent) {
        e.stopPropagation();
        setEditingEmployee(employee);
        setData({
            name: employee.name,
            email: employee.email,
            role: "employee",
            company_id: employee.company ? String(employee.company.id) : "",
            job_position_id: employee.job_position
                ? String(employee.job_position.id)
                : "",
        });
        setDialogOpen(true);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editingEmployee) {
            put(`/admin/users/${editingEmployee.id}`, {
                onSuccess: () => {
                    reset();
                    setDialogOpen(false);
                },
            });
        } else {
            post("/admin/users", {
                onSuccess: () => {
                    reset();
                    setDialogOpen(false);
                },
            });
        }
    }

    function handleDeleteConfirm() {
        if (deletingEmployee) {
            router.delete(`/admin/users/${deletingEmployee.id}`, {
                preserveScroll: true,
            });
            setDeletingEmployee(null);
        }
    }

    function handleDeleteClick(employee: Employee, e: React.MouseEvent) {
        e.stopPropagation();
        setDeletingEmployee(employee);
    }

    function isExpired(expiresAt: string | null) {
        return expiresAt ? new Date(expiresAt) < new Date() : false;
    }

    return (
        <Master>
            <Head title="Employees" />

            <div className="w-full space-y-6 p-6 lg:p-8">
                <div className="flex items-center justify-between border-b pb-5">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">
                            Employees
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage employee accounts and their orientation
                            access.
                        </p>
                    </div>
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Employee
                    </Button>
                </div>

                {employees.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                            <Users2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                No employees yet
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Create one to get started.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Access Expires</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.map((employee) => {
                                    const expired = isExpired(
                                        employee.expires_at,
                                    );
                                    const progressPct = employee.total_folders
                                        ? (employee.completed_folders /
                                              employee.total_folders) *
                                          100
                                        : 0;

                                    return (
                                        <TableRow
                                            key={employee.id}
                                            className="cursor-pointer"
                                            onClick={() =>
                                                setViewingEmployee(employee)
                                            }
                                        >
                                            <TableCell className="">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <p className="font-medium leading-none">
                                                            {employee.name}
                                                        </p>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {employee.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={
                                                            employee.company
                                                                ?.logo_path
                                                                ? `/storage/${employee.company.logo_path}`
                                                                : undefined
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {employee.company?.name?.charAt(
                                                            0,
                                                        ) ?? "—"}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <span>
                                                    {employee.company?.name ??
                                                        "—"}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Progress
                                                        value={progressPct}
                                                        className="h-1.5 w-16"
                                                    />
                                                    <span className="text-xs text-muted-foreground">
                                                        {
                                                            employee.completed_folders
                                                        }
                                                        /
                                                        {employee.total_folders}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={cn(
                                                        "font-normal",
                                                        statusMap[
                                                            employee.status
                                                        ].className,
                                                    )}
                                                >
                                                    {
                                                        statusMap[
                                                            employee.status
                                                        ].label
                                                    }
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {employee.expires_at ? (
                                                    <Badge
                                                        variant={
                                                            expired
                                                                ? "destructive"
                                                                : "secondary"
                                                        }
                                                        className="gap-1 font-normal"
                                                    >
                                                        <CalendarClock className="h-3 w-3" />
                                                        {expired
                                                            ? "Expired"
                                                            : new Date(
                                                                  employee.expires_at,
                                                              ).toLocaleDateString()}
                                                    </Badge>
                                                ) : (
                                                    "—"
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 cursor-pointer"
                                                        onClick={(e) =>
                                                            openEdit(
                                                                employee,
                                                                e,
                                                            )
                                                        }
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                                                        onClick={(e) =>
                                                            handleDeleteClick(
                                                                employee,
                                                                e,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {editingEmployee ? "Edit Employee" : "New Employee"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingEmployee
                                ? "Update the employee details below."
                                : "Access expires 2 days after the account is created."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Full name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Juan Dela Cruz"
                                autoFocus
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                placeholder="employee@company.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label>Company</Label>
                            <Select
                                value={data.company_id}
                                onValueChange={(val) => {
                                    setData("company_id", val);
                                    setData("job_position_id", "");
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a company" />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {companies.map((company) => (
                                        <SelectItem
                                            key={company.id}
                                            value={String(company.id)}
                                        >
                                            {company.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.company_id && (
                                <p className="text-sm text-destructive">
                                    {errors.company_id}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label>Job position</Label>
                            <Select
                                value={data.job_position_id}
                                onValueChange={(val) =>
                                    setData("job_position_id", val)
                                }
                                disabled={!data.company_id}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue
                                        placeholder={
                                            data.company_id
                                                ? "Select a position"
                                                : "Select a company first"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    {availablePositions.map((position) => (
                                        <SelectItem
                                            key={position.id}
                                            value={String(position.id)}
                                        >
                                            {position.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.job_position_id && (
                                <p className="text-sm text-destructive">
                                    {errors.job_position_id}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="cursor-pointer"
                            >
                                {processing
                                    ? "Saving..."
                                    : editingEmployee
                                      ? "Save Changes"
                                      : "Create Employee"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={!!deletingEmployee}
                onOpenChange={(o) => !o && setDeletingEmployee(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <Trash2 />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Delete Account?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this employee's account
                            and all their orientation progress records. This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            className=""
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <EmployeeDetailDialog
                employee={viewingEmployee}
                onClose={() => setViewingEmployee(null)}
            />
        </Master>
    );
}
