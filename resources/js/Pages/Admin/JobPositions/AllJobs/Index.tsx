import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { router } from "@inertiajs/react";
import type { JobPosition, JobSortOption } from "../../Types/job-position";
import Master from "@/Layout/Master";
import JobList from "./components/JobList";
import CreateJobDialog from "./components/forms/CreateJobDialog";
import EditJobDialog from "./components/forms/EditJobDialog";
import DeleteJobDialog from "./components/forms/DeleteJobDialog";
import ToolbarJob from "./components/ToolbarJob";
import DeleteSelectedJobs from "./components/forms/DeleteSelectedJobs";
import AppPagination from "./components/Pagination";
import type { Paginated } from "../../Types/job-position";
type Props = {
    jobs: Paginated<JobPosition>;
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

    const [deleteSelectedOpen, setDeleteSelectedOpen] = useState(false);
    const [sort, setSort] = useState<JobSortOption>("assigned");
    const filteredJobs = jobs.data
        .filter((job) => job.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const aCompanies = a.companies?.length ?? 0;
            const bCompanies = b.companies?.length ?? 0;

            switch (sort) {
                case "assigned":
                    if (aCompanies === 0 && bCompanies > 0) return 1;
                    if (aCompanies > 0 && bCompanies === 0) return -1;

                    return a.name.localeCompare(b.name);

                case "most-companies":
                    return bCompanies - aCompanies;

                case "least-companies":
                    return aCompanies - bCompanies;

                default:
                    return 0;
            }
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
                    sort={sort}
                    onSortChange={setSort}
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
                <AppPagination
                    from={jobs.from}
                    to={jobs.to}
                    total={jobs.total}
                    currentPage={jobs.current_page}
                    lastPage={jobs.last_page}
                    onPrevious={() => {
                        router.visit(jobs?.prev_page_url)
                    }}
                    onNext={() => {
                        router.visit(jobs?.next_page_url)
                    }}
                    onPageChange={(page) => {
                        router.visit(window.location.pathname, {
                            data: { page: page }
                        });
                    }}
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
