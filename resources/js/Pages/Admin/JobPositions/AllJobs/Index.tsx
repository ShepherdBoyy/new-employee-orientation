import { useState } from "react";
import type { JobPosition } from "../../Types/job-position";
import Master from "@/Layout/Master";
import JobsTable from "./components/JobsTable";
import CreateJobDialog from "./components/CreateJobDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import EditJobDialog from "./components/EditJobDialog";
import DeleteJobDialog from "./components/DeleteJobDialog";
import { router } from "@inertiajs/react";
type Props = {
    jobs: JobPosition[];
};
export default function Index({ jobs }: Props) {
    function handleDelete() {
        if (!deletingJob) return;

        router.delete(`/admin/jobs/${deletingJob.id}`, {
            onSuccess: () => {
                setDeletingJob(null);
            },
        });
    }
    const [editingJob, setEditingJob] = useState<JobPosition | null>(null);
    const [deletingJob, setDeletingJob] = useState<JobPosition | null>(null);
    const [createOpen, setCreateOpen] = useState(false);
    console.log(jobs);
    return (
        <Master>
            <div className="max-w-5xl mx-auto">
                <div>
                    <h1>Job Positions </h1>
                    <p>
                        Job Positions are reusable roles that can later be
                        assigned to one or more companies.
                    </p>
                </div>
                <Separator />

                <Button size="lg" onClick={() => setCreateOpen(true)}>
                    New Job
                </Button>
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
            <EditJobDialog
                job={editingJob}
                onClose={() => setEditingJob(null)}
            />
            <DeleteJobDialog
                job={deletingJob}
                onClose={() => setDeletingJob(null)}
                onConfirm={handleDelete}
            />
        </Master>
    );
}
