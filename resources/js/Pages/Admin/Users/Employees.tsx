import { useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useForm, router } from "@inertiajs/react";
import EmployeeTable from "./components/EmployeeTable";
import { Plus, Trash2, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import EmployeeDetailDialog, {
    type Employee as EmployeeDetail,
} from "./components/EmployeeDetailDialog";
import Master from "@/Layout/Master";
import type { JobPosition } from "../Types/job-position";
import type { CompanyWithJobs } from "../Types/company";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import AppPagination from "@/Layout/Pagination";
import EmployeeFilters from "./components/EmployeeFilters";
import type { Paginated } from "../Types/job-position";
import { EmployeeDetailsDrawer } from "./components/EmployeeDetailsDrawer";
export interface Employee {
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
    employees: Paginated<Employee>;
    companies: CompanyWithJobs[];
}

function Employees({ employees: initialEmployees, companies }: Props) {
    const [search, setSearch] = useState("");
    const [companyFilter, setCompanyFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
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

    const employeeStats = useMemo(() => {
        const data = employees.data;

        return {
            total: employees.total,
            ongoing: data.filter(
                (employee) => employee.status === "in_progress",
            ).length,
            acknowledged: data.filter(
                (employee) => employee.status === "acknowledged",
            ).length,
            not_started: data.filter(
                (employee) => employee.status === "not_started",
            ).length,
        };
    }, [employees]);

    function StatCard({
        label,
        value,
        description,
    }: {
        label: string;
        value: number;
        description: string;
    }) {
        return (
            <>
                <Card className="">
                    <CardHeader className="flex items-center justify-between gap-3">
                        <CardTitle>{label}</CardTitle>

                        <CardDescription>{value}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                            {description}
                        </p>
                    </CardContent>
                </Card>
            </>
        );
    }

    const filteredEmployee = useMemo(() => {
        return employees.data.filter((employee) => {
            const matchesStatus =
                statusFilter === "all" || employee.status === statusFilter;
            return matchesStatus;
        });
    }, [employees, search, companyFilter, statusFilter]);

    function clearFilters() {
        setSearch("");
        setCompanyFilter("all");
        setStatusFilter("all");

        router.get(
            "/admin/users/employees",
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }
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

    function openEdit(employee: Employee) {
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
    const hasActiveFilters =
        search.trim() !== "" ||
        companyFilter !== "all" ||
        statusFilter !== "all";

    const handleSearch = useDebouncedCallback((searchValue, companyValue) => {
        router.get(
            "/admin/users/employees",
            {
                search: searchValue,
                company_id: companyValue, // Include company filter here
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, 300);

    const handleSearchChange = (e) => {
        setSearch(e);
        handleSearch(e, companyFilter); // Pass current company state
    };

    const handleCompanyChange = (e) => {
        const value = e;
        setCompanyFilter(value);

        // Trigger immediate request or debounced search with the new company value
        router.get(
            "/admin/users/employees",
            {
                search: search || undefined,
                company_id: value === "all" ? undefined : value,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };
    return (
        <>
            <div className="w-full space-y-6">
                <div className="flex items-start justify-between gap-4 border-b pb-5">
                    <div className="min-w-0">
                        <h1 className="text-xl font-semibold tracking-tight">
                            Employees
                        </h1>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage employee accounts, assignments, and
                            orientation progress.
                        </p>
                    </div>

                    <Button onClick={openCreate} className="shrink-0" size="lg">
                        <Plus className="mr-2 size-4" />
                        New Employee
                    </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Total Employees"
                        value={employeeStats.total}
                        description="All registered employees"
                    />

                    <StatCard
                        label="In Progress"
                        value={employeeStats.ongoing}
                        description="Currently completing orientation"
                    />

                    <StatCard
                        label="Acknowledged"
                        value={employeeStats.acknowledged}
                        description="Orientation completed"
                    />

                    <StatCard
                        label="Not Started"
                        value={employeeStats.not_started}
                        description="Awaiting orientation"
                    />
                </div>
                <EmployeeFilters
                    search={search}
                    onSearchChange={handleSearchChange}
                    companyFilter={companyFilter}
                    onCompanyChange={handleCompanyChange}
                    companies={companies}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    onClear={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                />

                {employees.data.length === 0 ? (
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
                    <div className="rounded-xl  ">
                        <EmployeeTable
                            employees={filteredEmployee}
                            onView={setViewingEmployee}
                            onEdit={openEdit}
                            onDelete={setDeletingEmployee}
                        />
                    </div>
                )}
            </div>
            <div className="pt-2">
                <AppPagination
                    from={employees.from}
                    to={employees.to}
                    total={employees.total}
                    currentPage={employees.current_page}
                    lastPage={employees.last_page}
                    onPrevious={employees?.prev_page_url}
                    onNext={employees?.next_page_url}
                    onPageChange={(page) => {
                        // 1. Get existing query parameters from the current URL
                        const params = new URLSearchParams(
                            window.location.search,
                        );

                        // 2. Set or update the page parameter
                        params.set("page", page);

                        // 3. Convert params back to a plain object for Inertia's data option
                        const queryData = Object.fromEntries(params.entries());

                        router.visit(window.location.pathname, {
                            data: queryData,
                            preserveState: true, // Optional: keeps component state if desired
                            preserveScroll: true, // Optional: keeps scroll position
                        });
                    }}
                />
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
                                    {availablePositions.length === 0 ? (
                                        <div className="px-3 py-6 text-center">
                                            <p className="text-sm font-medium text-foreground">
                                                No job positions available
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Make sure the job position has a
                                                JD/document uploaded.
                                            </p>
                                        </div>
                                    ) : (
                                        availablePositions.map((position) => (
                                            <SelectItem
                                                key={position.id}
                                                value={String(position.id)}
                                            >
                                                {position.name}
                                            </SelectItem>
                                        ))
                                    )}
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
        </>
    );
}

Employees.layout = (page: React.ReactNode) => <Master>{page}</Master>;

export default Employees;
