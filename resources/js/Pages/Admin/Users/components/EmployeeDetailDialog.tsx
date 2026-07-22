import { useEffect, useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    CheckCircle2,
    Circle,
    ShieldCheck,
    Eye,
    Loader2,
    FileSignature,
    ImageIcon,
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
}

export interface Employee {
    id: number;
    name: string;
    email: string;
    company: { id: number; name: string; logo_path: string } | null;
    job_position: { id: number; name: string } | null;
    status: "not_started" | "in_progress" | "acknowledged";
}

interface Props {
    employee: Employee | null;
    onClose: () => void;
}

export default function EmployeeDetailDialog({ employee, onClose }: Props) {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<ProgressResponse | null>(null);

    const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [loadingSignature, setLoadingSignature] = useState(false);
    const [loadingPhoto, setLoadingPhoto] = useState(false);

    useEffect(() => {
        if (!employee) {
            setData(null);
            setSignatureUrl(null);
            setPhotoUrl(null);
            return;
        }

        setLoading(true);
        axios
            .get(`/admin/users/employees/${employee.id}/progress`)
            .then((res) => setData(res.data))
            .finally(() => setLoading(false));
    }, [employee]);

    function handleViewSignature() {
        if (!employee) return;
        setLoadingSignature(true);
        axios
            .get(`/admin/users/employees/${employee.id}/signature`)
            .then((res) => setSignatureUrl(res.data.url))
            .finally(() => setLoadingSignature(false));
    }

    function handleViewPhoto() {
        if (!employee) return;
        setLoadingPhoto(true);
        axios
            .get(`/admin/users/employees/${employee.id}/photo`)
            .then((res) => setPhotoUrl(res.data.url))
            .finally(() => setLoadingPhoto(false));
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

    return (
        <Dialog open={!!employee} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
                {employee && (
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className="min-w-0 flex-1 text-left">
                                    <DialogTitle className="truncate">
                                        {employee.name}
                                    </DialogTitle>
                                    <DialogDescription className="truncate">
                                        {employee.email}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="flex gap-2 text-xs text-muted-foreground items-center">
                            <span className="flex items-center gap-1">
                                <Avatar>
                                    <AvatarImage
                                        src={`/storage/${employee.company?.logo_path}`}
                                    />
                                </Avatar>
                                {employee.company?.name ?? "No company"}
                            </span>
                            <span>·</span>
                            <span>
                                {employee.job_position?.name ?? "No position"}
                            </span>
                        </div>

                        <Separator />

                        {loading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {/* Folder progress */}
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <h3 className="text-sm font-semibold">
                                            Module Progress:
                                        </h3>
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
                                        <p className="text-sm text-muted-foreground">
                                            No modules assigned to this
                                            employee.
                                        </p>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                            {data?.folders.map((folder) => (
                                                <div
                                                    key={folder.id}
                                                    className={cn(
                                                        "flex items-start gap-2.5 rounded-lg border px-3 py-2.5",
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
                                                        <p className="truncate text-sm font-medium leading-none">
                                                            {folder.name}
                                                        </p>
                                                        <p className="mt-1 text-xs text-muted-foreground">
                                                            {folder.completed_at
                                                                ? `Completed ${new Date(folder.completed_at).toLocaleDateString()}`
                                                                : `${folder.slide_count} ${folder.slide_count === 1 ? "slide" : "slides"}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                {/* Acknowledgement */}
                                <div className="space-y-2">
                                    <h3 className="flex items-center gap-1.5 text-sm font-semibold">
                                        <ShieldCheck className="h-4 w-4" />
                                        Final Acknowledgement
                                    </h3>

                                    {!data?.acknowledgement ? (
                                        <p className="text-sm text-muted-foreground">
                                            This employee has not yet submitted
                                            their final acknowledgement.
                                        </p>
                                    ) : (
                                        <div className="space-y-3 rounded-xl border bg-muted/20 p-3.5">
                                            <div className="grid grid-cols-2 gap-3 text-xs">
                                                <div>
                                                    <p className="text-muted-foreground">
                                                        Confirmed name
                                                    </p>
                                                    <p className="mt-0.5 font-medium">
                                                        {
                                                            data.acknowledgement
                                                                .full_name_confirmation
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground">
                                                        Acknowledged at
                                                    </p>
                                                    <p className="mt-0.5 font-medium">
                                                        {
                                                            data.acknowledgement
                                                                .acknowledged_at
                                                        }
                                                    </p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-muted-foreground">
                                                        IP address
                                                    </p>
                                                    <p className="mt-0.5 font-medium">
                                                        {
                                                            data.acknowledgement
                                                                .ip_address
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Signature */}
                                                <div className="space-y-1.5">
                                                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <FileSignature className="h-3 w-3" />
                                                        Signature
                                                    </p>
                                                    {signatureUrl ? (
                                                        <img
                                                            src={signatureUrl}
                                                            alt="Signature"
                                                            className="h-20 w-full rounded-lg border bg-white object-contain p-1"
                                                        />
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full"
                                                            onClick={
                                                                handleViewSignature
                                                            }
                                                            disabled={
                                                                loadingSignature
                                                            }
                                                        >
                                                            {loadingSignature ? (
                                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                                                                    View
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>

                                                {/* Photo */}
                                                <div className="space-y-1.5">
                                                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <ImageIcon className="h-3 w-3" />
                                                        Photo
                                                    </p>
                                                    {photoUrl ? (
                                                        <img
                                                            src={photoUrl}
                                                            alt="Employee photo"
                                                            className="h-20 w-full rounded-lg border object-cover"
                                                        />
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full"
                                                            onClick={
                                                                handleViewPhoto
                                                            }
                                                            disabled={
                                                                loadingPhoto
                                                            }
                                                        >
                                                            {loadingPhoto ? (
                                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                                                                    View
                                                                </>
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
