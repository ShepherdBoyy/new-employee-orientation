import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import JobTableActions from "./JobActions";
import { CircleArrowOutUpRight } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";
import type { JobPosition } from "@/Pages/Admin/Types/job-position";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Building2 } from "lucide-react";
type Props = {
    selected: boolean;
    onToggle: () => void;
    job: JobPosition;
    onEdit: (job: JobPosition) => void;
    onDelete: (job: JobPosition) => void;
};
import { cn } from "@/lib/utils";
export default function JobCard({
    job,
    onEdit,
    onDelete,
    selected,
    onToggle,
}: Props) {
    return (
        <>
            <TableRow
                className={cn(
                    "group border-b transition-colors",
                    "hover:bg-muted/50",
                    selected && "bg-primary/[0.04]",
                )}
            >
                <TableCell>
                    <Checkbox checked={selected} onCheckedChange={onToggle} />
                </TableCell>
                <TableCell>
                    <div className="">
                        <p className="truncate text-sm font-medium">
                            {job.name}
                        </p>
                    </div>
                </TableCell>
                <TableCell className="w-60">
                    <div>
                        <Badge
                            variant="secondary"
                            className="rounded-md text-[12px]"
                        >
                            {job.type === "field_based" ? (
                                <>
                                    <MapPin
                                        data-icon="inline-start"
                                        absoluteStrokeWidth
                                        strokeWidth={2}
                                    />
                                    Field Based
                                </>
                            ) : (
                                <>
                                    <Building2
                                        absoluteStrokeWidth
                                        strokeWidth={2}
                                        data-icon="inline-start"
                                    />
                                    Non-Field Based
                                </>
                            )}
                        </Badge>
                    </div>
                </TableCell>
                <TableCell className="w-13 text-right">
                    <JobTableActions
                        job={job}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </TableCell>
            </TableRow>
        </>
    );
}
