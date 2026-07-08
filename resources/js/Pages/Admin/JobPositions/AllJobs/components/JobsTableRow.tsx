import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import JobTableActions from "./JobActions";
import type { JobPosition } from "@/Pages/Admin/Types/job-position";

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
                    <Badge variant="secondary">
                        <Badge variant="secondary">
                            {job.companies_count === 0
                                ? "Not Assigned"
                                : `${job.companies_count} ${
                                      job.companies_count === 1
                                          ? "Company"
                                          : "Companies"
                                  }`}
                        </Badge>
                    </Badge>
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
