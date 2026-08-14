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
import AppPagination from "../../../../Layout/Pagination";
import type { Paginated } from "../../Types/job-position";
import { useDebouncedCallback } from 'use-debounce';

type Props = {
    jobs: Paginated<JobPosition>;
};

function Index({ jobs }: Props) {
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
    const [selectedJobIds, setSelectedJobIds] = useState<number[]>([]);
    const [search, setSearch] = useState("");
    const [deleteSelectedOpen, setDeleteSelectedOpen] = useState(false);
    const [sort, setSort] = useState<JobSortOption>("assigned");
    const filteredJobs = jobs.data
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

    const handleSearch = useDebouncedCallback((value) => {
        router.get('/admin/job-positions', // Update with your actual route name
            { 
                search: value,
                page: 1
            }, 
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }, 300);

    const handleSearchChange = (e) => {
        setSearch(e);
        handleSearch(e);
    };
    
    return (
        <>
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
                    onSearchChange={handleSearchChange} // Pass the wrapper function here
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
                    onPrevious={jobs?.prev_page_url}
                    onNext={jobs?.next_page_url}
                    onPageChange={(page) => {
                        // 1. Get existing query parameters from the current URL
                        const params = new URLSearchParams(window.location.search);
                        
                        // 2. Set or update the page parameter
                        params.set('page', page);
                        
                        // 3. Convert params back to a plain object for Inertia's data option
                        const queryData = Object.fromEntries(params.entries());

                        router.visit(window.location.pathname, {
                            data: queryData,
                            preserveState: true, // Optional: keeps component state if desired
                            preserveScroll: true, // Optional: keeps scroll position
                        });
                    }}
                />

                {/* Forms */}
                <EditJobDialog
                    job={editingJob}
                    onClose={() => setEditingJob(null)}
                />
                {deletingJob && (
                    <DeleteJobDialog
                        job={deletingJob}
                        onClose={() => setDeletingJob(null)}
                        onConfirm={handleDelete}
                    />
                )}
                <DeleteSelectedJobs
                    ids={selectedJobIds}
                    setIds={setSelectedJobIds}
                    open={deleteSelectedOpen}
                    onClose={() => setDeleteSelectedOpen(false)}
                />
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <Master>{page}</Master>;
export default Index;
