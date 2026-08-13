import React from "react";
import {
    CalendarClock,
    EllipsisVertical,
    Eye,
    Pencil,
    Trash2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { TableCell, TableRow } from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { Employee } from "../Employees";

interface EmployeeTableRowProps {
    employee: Employee;
    onView: (employee: Employee) => void;
    onEdit: (employee: Employee) => void;
    onDelete: (employee: Employee) => void;
}

export default function EmployeeTableRow({
    employee,
    onView,
    onEdit,
    onDelete,
}: EmployeeTableRowProps) {
    const progressPct =
        employee.total_folders > 0
            ? (employee.completed_folders / employee.total_folders) * 100
            : 0;

    return (
        <TableRow
            key={employee.id}
            onClick={() => onView(employee)}
            className="cursor-pointer"
        >
            <TableCell className="py-4">
                <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="size-8 shrink-0">
                        <AvatarFallback className="text-xs font-medium">
                            {employee.name
                                .split(" ")
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                        <p className="cursor-pointer text-sm font-medium transition-colors hover:text-primary">
                            {employee.name}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                            {employee.email}
                        </p>
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-4">
                <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar className="size-8 shrink-0 rounded-lg">
                        <AvatarImage
                            src={
                                employee.company?.logo_path
                                    ? `/storage/${employee.company.logo_path}`
                                    : undefined
                            }
                        />

                        <AvatarFallback className="rounded-lg text-xs">
                            {employee.company?.name?.charAt(0) ?? "—"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                            {employee.company?.name ?? "No company"}
                        </p>

                        <p className="truncate text-xs text-muted-foreground">
                            {employee.job_position?.name ?? "No position"}
                        </p>
                    </div>
                </div>
            </TableCell>
            <TableCell className="py-4">
                <div className="w-32">
                    <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs font-medium">
                            {Math.round(progressPct)}%
                        </span>

                        <span className="text-[11px] text-muted-foreground">
                            {employee.completed_folders}/
                            {employee.total_folders}
                        </span>
                    </div>

                    <Progress value={progressPct} className="h-1.5" />
                </div>
            </TableCell>
            <TableCell className="py-4">
                <Badge
                    variant="secondary"
                    className={cn(
                        "gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                        employee.status === "acknowledged" &&
                            "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
                        employee.status === "in_progress" &&
                            "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
                        employee.status === "not_started" &&
                            "bg-muted text-muted-foreground",
                    )}
                >
                    <span className="size-1.5 rounded-full bg-current" />

                    {employee.status === "acknowledged"
                        ? "Acknowledged"
                        : employee.status === "in_progress"
                          ? "Ongoing"
                          : "Not Started"}
                </Badge>
            </TableCell>
            <TableCell className="py-4">
                {employee.expires_at ? (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarClock className="size-3.5" />

                        <span>
                            {new Date(employee.expires_at).toLocaleDateString()}
                        </span>
                    </div>
                ) : (
                    <span className="text-xs text-muted-foreground">
                        No expiry
                    </span>
                )}
            </TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <EllipsisVertical className="size-4" />

                            <span className="sr-only">
                                Open employee actions
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="">
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(employee);
                            }}
                        >
                            <Pencil className="size-4" />
                            Edit
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            variant="destructive"
                            onClick={(e) => {
                                e.stopPropagation();

                                onDelete(employee);
                            }}
                        >
                            <Trash2 className="size-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}
