import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import JobsTableRow from "./JobsTableRow";
import type { JobPosition } from "@/Pages/Admin/Types/job-position";

type Props = {
    jobs: JobPosition[];
    onEdit: (jobs: JobPosition) => void;
    onDelete: (jobs: JobPosition) => void;
};

export default function JobsTable({ jobs, onEdit, onDelete }: Props) {
    console.log(jobs);
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Job Position</TableHead>
                    <TableHead>Companies</TableHead>
                    <TableHead className="w-16" />
                </TableRow>
            </TableHeader>

            <TableBody>
                {jobs?.map((job) => (
                    <JobsTableRow
                        key={job.id}
                        job={job}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </TableBody>
        </Table>
    );
}
