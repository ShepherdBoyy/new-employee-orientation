import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import JobCard from "./JobCard";

import type { JobPosition } from "@/Pages/Admin/Types/job-position";
import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
} from "@/components/ui/empty";

type Props = {
    jobs: JobPosition[];
    onEdit: (jobs: JobPosition) => void;
    onDelete: (jobs: JobPosition) => void;
    selected: number[];
    onSelectionChange: (ids: number[]) => void;
};

export default function JobList({
    jobs,
    onEdit,
    onDelete,
    selected,
    onSelectionChange,
}: Props) {
    if (!jobs.length) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyTitle>No job positions</EmptyTitle>
                    <EmptyDescription>
                        Create your first reusable job position.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        );
    }
    return (
        <div className="grid grid-cols-4 gap-3">
            {jobs.map((job) => (
                <JobCard
                    key={job.id}
                    job={job}
                    selected={selected.includes(job.id)}
                    onToggle={() => {
                        const exists = selected.includes(job.id);

                        onSelectionChange(
                            exists
                                ? selected.filter((id) => id !== job.id)
                                : [...selected, job.id],
                        );
                    }}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
