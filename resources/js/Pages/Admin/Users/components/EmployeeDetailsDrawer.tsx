import { useEffect, useState } from "react";
import axios from "axios";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    CheckCircle2,
    Circle,
    ShieldCheck,
    Download,
    FileText,
    FileUser,
    Footprints,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FolderProgress {
    id: number;
    name: string;
    slide_count: number;
    completed: boolean;
    completed_at: string | null;
}

interface AcknowledgementInfo {
    full_name_confirmation: string;
    acknowledged_at: string;
    ip_address: string;
}

interface ProgressResponse {
    folders: FolderProgress[];
    acknowledgement: AcknowledgementInfo | null;
    signed_jd_submitted: boolean;
    signed_jd_uploaded_at: string | null;
}

export interface Employee {
    id: number;
    name: string;
    email: string;
    company: {
        id: number;
        name: string;
        logo_path: string;
    } | null;
    job_position: {
        id: number;
        name: string;
    } | null;
    status: "not_started" | "in_progress" | "acknowledged";
}

interface Props {
    employee: Employee | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function EmployeeDetailsDrawer({
    employee,
    open,
    onOpenChange,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ProgressResponse | null>(null);

    useEffect(() => {
        if (!employee || !open) {
            setData(null);
            return;
        }

        setLoading(true);

        axios
            .get(`/admin/users/employees/${employee.id}/progress`)
            .then((res) => setData(res.data))
            .finally(() => setLoading(false));
    }, [employee, open]);

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

    if (!employee) {
        return null;
    }

    return (
        <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
            <DrawerContent className="w-200! max-w-200!">
                <DrawerHeader className="border-b">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <Avatar className="size-11 shrink-0">
                                <AvatarFallback className=" font-medium">
                                    {employee.name
                                        .split(" ")
                                        .map((part) => part[0])
                                        .slice(0, 2)
                                        .join("")
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                                <DrawerTitle className="truncate">
                                    {employee.name}
                                </DrawerTitle>

                                <DrawerDescription className="truncate">
                                    {employee.email}
                                </DrawerDescription>
                            </div>
                        </div>

                        <Badge
                            className={cn(
                                "shrink-0 font-normal",
                                statusMap[employee.status].className,
                            )}
                        >
                            {statusMap[employee.status].label}
                        </Badge>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-3 text-xs text-muted-foreground">
                        <span>{employee.company?.name ?? "No company"}</span>

                        <span className="text-muted-foreground/40">•</span>

                        <span>
                            {employee.job_position?.name ?? "No position"}
                        </span>
                    </div>
                </DrawerHeader>

                <div className="flex-1 overflow-y-auto px-4 py-5">
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-24 w-full" />

                            <div className="space-y-3">
                                <Skeleton className="h-5 w-40" />
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <Skeleton className="h-16 w-full" />
                                    <Skeleton className="h-16 w-full" />
                                    <Skeleton className="h-16 w-full" />
                                    <Skeleton className="h-16 w-full" />
                                </div>
                            </div>

                            <Separator />

                            <Skeleton className="h-24 w-full" />

                            <Separator />

                            <Skeleton className="h-24 w-full" />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Employee Information */}
                            <section className="space-y-3">
                                <div>
                                    <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                                        <FileUser
                                            className="h-5 w-5"
                                            strokeWidth={1.6}
                                        />
                                        Employee Information
                                    </h3>

                                    <p className="mt-2 text-xs text-muted-foreground">
                                        Basic employee and assignment details.
                                    </p>
                                </div>

                                <div className="rounded-xl border bg-muted/20 p-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">
                                                Full Name
                                            </p>

                                            <p className="mt-1 truncate text-sm font-medium">
                                                {employee.name}
                                            </p>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">
                                                Email
                                            </p>

                                            <p className="mt-1 truncate text-sm font-medium">
                                                {employee.email}
                                            </p>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">
                                                Company
                                            </p>

                                            <p className="mt-1 truncate text-sm font-medium">
                                                {employee.company?.name ??
                                                    "No company"}
                                            </p>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground">
                                                Job Position
                                            </p>

                                            <p className="mt-1 truncate text-sm font-medium">
                                                {employee.job_position?.name ??
                                                    "No position"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <Separator />

                            {/* Module Progress */}
                            <section className="space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                                            <Footprints
                                                className="h-5 w-5"
                                                strokeWidth={1.6}
                                            />
                                            Module Progress
                                        </h3>

                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Track the employee's orientation
                                            modules.
                                        </p>
                                    </div>

                                    <Badge
                                        className={cn(
                                            "shrink-0 font-normal",
                                            statusMap[employee.status]
                                                .className,
                                        )}
                                    >
                                        {statusMap[employee.status].label}
                                    </Badge>
                                </div>

                                {data?.folders.length === 0 ? (
                                    <div className="rounded-xl border border-dashed p-5 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            No modules assigned to this
                                            employee.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid gap-2 sm:grid-cols-2">
                                        {data?.folders.map((folder) => (
                                            <div
                                                key={folder.id}
                                                className={cn(
                                                    "flex items-start gap-2.5 rounded-xl border px-3 py-3",
                                                    folder.completed
                                                        ? "bg-emerald-50/50 dark:bg-emerald-950/10"
                                                        : "bg-muted/20",
                                                )}
                                            >
                                                {folder.completed ? (
                                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                                ) : (
                                                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                                                )}

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium">
                                                        {folder.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {folder.completed_at
                                                            ? `Completed ${new Date(
                                                                  folder.completed_at,
                                                              ).toLocaleDateString()}`
                                                            : `${folder.slide_count} ${
                                                                  folder.slide_count ===
                                                                  1
                                                                      ? "slide"
                                                                      : "slides"
                                                              }`}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <Separator />

                            {/* Final Acknowledgement */}
                            <section className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                                            <ShieldCheck className="h-4 w-4" />
                                            Final Acknowledgement
                                        </h3>

                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Employee's final orientation
                                            acknowledgement.
                                        </p>
                                    </div>

                                    {data?.acknowledgement && (
                                        <a
                                            href={`/admin/users/employees/${employee.id}/acknowledgement/pdf`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button size="sm" variant="outline">
                                                <Download className="mr-1.5 h-3.5 w-3.5" />
                                                Export PDF
                                            </Button>
                                        </a>
                                    )}
                                </div>

                                {!data?.acknowledgement ? (
                                    <div className="rounded-xl border border-dashed p-4">
                                        <p className="text-sm text-muted-foreground">
                                            This employee has not yet submitted
                                            their final acknowledgement.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border bg-muted/20 p-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Acknowledged On
                                                </p>

                                                <p className="mt-1 text-sm font-medium">
                                                    {
                                                        data.acknowledgement
                                                            .acknowledged_at
                                                    }
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    Confirmed Name
                                                </p>

                                                <p className="mt-1 text-sm font-medium">
                                                    {
                                                        data.acknowledgement
                                                            .full_name_confirmation
                                                    }
                                                </p>
                                            </div>

                                            <div className="sm:col-span-2">
                                                <p className="text-xs text-muted-foreground">
                                                    IP Address
                                                </p>

                                                <p className="mt-1 text-sm font-medium">
                                                    {
                                                        data.acknowledgement
                                                            .ip_address
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </section>

                            <Separator />

                            {/* Signed Job Description */}
                            <section className="space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                                            <FileText className="h-4 w-4" />
                                            Signed Job Description
                                        </h3>

                                        <p className="mt-2 text-xs text-muted-foreground">
                                            Employee's signed job description
                                            submission.
                                        </p>
                                    </div>

                                    {data?.signed_jd_submitted && (
                                        <a
                                            href={`/admin/users/employees/${employee.id}/signed-jd`}
                                        >
                                            <Button size="sm" variant="outline">
                                                <Download className="mr-1.5 h-3.5 w-3.5" />
                                                Download
                                            </Button>
                                        </a>
                                    )}
                                </div>

                                {!data?.signed_jd_submitted ? (
                                    <div className="rounded-xl border border-dashed p-4">
                                        <p className="text-sm text-muted-foreground">
                                            This employee has not uploaded a
                                            signed Job Description yet.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="rounded-xl border bg-muted/20 p-4">
                                        <p className="text-xs text-muted-foreground">
                                            Uploaded On
                                        </p>

                                        <p className="mt-1 text-sm font-medium">
                                            {data.signed_jd_uploaded_at}
                                        </p>
                                    </div>
                                )}
                            </section>
                        </div>
                    )}
                </div>

                <DrawerFooter className="border-t">
                    <DrawerClose
                        render={<Button variant="outline" className="w-full" />}
                    >
                        Close
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
