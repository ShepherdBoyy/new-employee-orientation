import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { router } from "@inertiajs/react";
import type { JobPosition } from "../../Types/job-position";
import Master from "@/Layout/Master";
import JobList from "./components/JobList";
import CreateJobDialog from "./components/forms/CreateJobDialog";
import EditJobDialog from "./components/forms/EditJobDialog";
import DeleteJobDialog from "./components/forms/DeleteJobDialog";
import ToolbarJob from "./components/ToolbarJob";
import DeleteSelectedJobs from "./components/forms/DeleteSelectedJobs";
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
    const [search, setSearch] = useState("");
    const [selectedJobIds, setSelectedJobIds] = useState<number[]>([]);

    const [selected, setSelected] = useState<number[]>([]);
    const [deleteSelectedOpen, setDeleteSelectedOpen] = useState(false);

    const filteredJobs = jobs
        .filter((job) => job.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const aAssigned = a.companies?.length ?? 0;
            const bAssigned = b.companies?.length ?? 0;

            // Assigned jobs first
            if (aAssigned === 0 && bAssigned > 0) return 1;
            if (aAssigned > 0 && bAssigned === 0) return -1;

            // Then alphabetically
            return a.name.localeCompare(b.name);
        });
    const allSelected =
        filteredJobs.length > 0 &&
        selectedJobIds.length === filteredJobs.length;

    function handleToggleAll() {
        if (allSelected) {
            setSelectedJobIds([]);
        } else {
            setSelectedJobIds(filteredJobs.map((job) => job.id));
        }
    }  
    
    
    return (
        <Master>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Job Positions
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Reusable roles that can later be assigned to one or
                            more companies.
                        </p>
                    </div>
                </div>

                <Separator />
                <ToolbarJob
                    search={search}
                    onSearchChange={setSearch}
                    allSelected={allSelected}
                    onToggleAll={handleToggleAll}
                    selectedCount={selectedJobIds.length}
                    onDeleteSelected={() => setDeleteSelectedOpen(true)}
                    onCreate={() => setCreateOpen(true)}
                />
                <CreateJobDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                />
                <JobList
                    jobs={filteredJobs}
                    selected={selectedJobIds}
                    onSelectionChange={setSelectedJobIds}
                    onEdit={setEditingJob}
                    onDelete={setDeletingJob}
                />
            </div>

            {/* Forms */}
            <EditJobDialog
                job={editingJob}
                onClose={() => setEditingJob(null)}
            />
            <DeleteJobDialog
                job={deletingJob}
                onClose={() => setDeletingJob(null)}
                onConfirm={handleDelete}
            />
            <DeleteSelectedJobs
                ids={selectedJobIds}
                setIds={setSelectedJobIds}
                open={deleteSelectedOpen}
                onClose={() => setDeleteSelectedOpen(false)}
            />
        </Master>
    );
}
