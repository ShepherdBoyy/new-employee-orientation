import JobCard from "./JobCard";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { JobPosition } from "@/Pages/Admin/Types/job-position";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
} from "@/components/ui/empty";
import { motion } from "motion/react";
import { listVariants } from "@/motion";

type Props = {
    jobs: JobPosition[];
    onEdit: (jobs: JobPosition) => void;
    onDelete: (jobs: JobPosition) => void;
    selected: number[];
    onSelectionChange: (ids: number[]) => void;
    allSelected: boolean;
    onToggleAll: () => void;
};

export default function JobList({
    jobs,
    onEdit,
    onDelete,
    selected,
    onSelectionChange,
    allSelected,
    onToggleAll,
}: Props) {
    const MotionTableBody = motion.create(TableBody);
    if (!jobs.length) {
        return (
            <Empty className="h-full">
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
        <div className="overflow-hidden rounded-xl border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={onToggleAll}
                            />
                        </TableHead>

                        <TableHead>Job Position</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead />
                    </TableRow>
                </TableHeader>

                <MotionTableBody
                    variants={listVariants}
                    initial="hidden"
                    animate="visible"
                >
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
                </MotionTableBody>
            </Table>
        </div>
    );
}
