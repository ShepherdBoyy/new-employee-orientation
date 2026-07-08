import { useState } from "react";
import type { JobPosition } from "../../Types/job-position";
import Master from "@/Layout/Master";
import JobsTable from "./components/JobsTable";
import CreateJobDialog from "./components/CreateJobDialog";
import { Button } from "@/components/ui/button";

type Props = {
    jobs: JobPosition[];
};
export default function Index({ jobs }: Props) {
    const [editingJob, setEditingJob] = useState<JobPosition | null>(null);

    const [deletingJob, setDeletingJob] = useState<JobPosition | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    return (
        <Master>
            <div>
                <Button onClick={() => setCreateOpen(true)}>New Job</Button>
                <CreateJobDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                />
                <JobsTable
                    jobs={jobs}
                    onEdit={setEditingJob}
                    onDelete={setDeletingJob}
                />
            </div>
        </Master>
    );
}
