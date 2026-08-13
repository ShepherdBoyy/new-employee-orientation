import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { Employee } from "../Employees";
import EmployeeTableRow from "./EmployeeTableRow";
import { UsersRound } from "lucide-react";

interface EmployeeTableProps {
    employees: Employee[];
    onView: (employee: Employee) => void;
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
}

export default function EmployeeTable({
    employees,
    onView,
    onDelete,
    onEdit,
}: EmployeeTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Assignment</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Access</TableHead>
                        <TableHead className="w-10" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.length > 0 ? (
                        employees.map((employee) => (
                            <EmployeeTableRow
                                key={employee.id}
                                employee={employee}
                                onView={onView}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="h-48">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
                                        <UsersRound className="size-5 text-muted-foreground" />
                                    </div>

                                    <p className="text-sm font-medium">
                                        No employees found
                                    </p>

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Try adjusting your search or filters.
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
