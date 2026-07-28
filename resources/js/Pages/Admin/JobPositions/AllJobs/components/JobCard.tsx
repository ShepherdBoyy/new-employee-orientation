import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import JobTableActions from "./JobActions";
import { CircleArrowOutUpRight } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Checkbox } from "@/components/ui/checkbox";
import type { JobPosition } from "@/Pages/Admin/Types/job-position";
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
    selected: boolean;
    onToggle: () => void;
    job: JobPosition;
    onEdit: (job: JobPosition) => void;
    onDelete: (job: JobPosition) => void;
};

export default function JobCard({
    job,
    onEdit,
    onDelete,
    selected,
    onToggle,
}: Props) {
    return (
        <>
            <Card className="transition-colors hover:bg-muted/30">
                <CardHeader className="flex justify-between">
                    <div className="flex gap-3 items-start">
                        {/* Added pt-1 or mt-0.5 to align the checkbox nicely with the title text baseline/height */}
                        <Checkbox
                            checked={selected}
                            onCheckedChange={onToggle}
                            className="mt-0.5" 
                        />

                        <div className="space-y-1">
                            <CardTitle>{job.name}</CardTitle>
                            <CardDescription>
                                <Badge variant="secondary">
                                    {job.type === 'field_based' ? 'Field Based' : 'Non-Field Based'}
                                </Badge>
                            </CardDescription>
                        </div>
                    </div>

                    <JobTableActions
                        job={job}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </CardHeader>
                <CardFooter className="justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                        {job.companies?.length
                            ? `Assigned to ${job.companies.length} ${
                                  job.companies.length === 1
                                      ? "company"
                                      : "companies"
                              }`
                            : "Not assigned yet"}
                    </span>

                    {job.companies?.length ? (
                        <div className="flex -space-x-4">
                            {job.companies.slice(0, 4).map((company) => (
                                <Avatar
                                    key={company.id}
                                    className="border-2 border-background size-8"
                                >
                                    <AvatarImage
                                        src={`/storage/${company.logo_path}`}
                                    />

                                    <AvatarFallback>
                                        {company.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                            ))}

                            {job.companies.length > 4 && (
                                <div className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium z-10">
                                    +{job.companies.length - 4}
                                </div>
                            )}
                        </div>
                    ) : (
                        <Button asChild variant="secondary" size="sm">
                            <Link href="/admin/all-job-positions">
                                <CircleArrowOutUpRight />
                                Assign Companies
                            </Link>
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </>
    );
}
