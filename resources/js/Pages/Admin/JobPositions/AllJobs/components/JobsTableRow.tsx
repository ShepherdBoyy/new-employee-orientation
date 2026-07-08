import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import JobTableActions from "./JobActions";
import type { JobPosition } from "@/Pages/Admin/Types/job-position";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
type Props = {
    job: JobPosition;
    onEdit: (job: JobPosition) => void;
    onDelete: (job: JobPosition) => void;
};

export default function JobsTableRow({ job, onEdit, onDelete }: Props) {
    return (
        <>
            <TableRow>
                <TableCell className="font-medium">{job.name}</TableCell>

                <TableCell>
                    <div className="flex gap-2">
                        {job.companies?.map((item) => (
                            <Badge variant="secondary">
                                <Avatar>
                                    <AvatarImage
                                        src={`/storage/${item.logo_path}`}
                                    />
                                    <AvatarFallback>
                                        {item.name[0]}
                                    </AvatarFallback>
                                </Avatar>

                                {item.name}
                            </Badge>
                        ))}
                    </div>
                </TableCell>

                <TableCell align="right">
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
