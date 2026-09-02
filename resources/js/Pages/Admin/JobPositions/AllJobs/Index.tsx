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
import { useDebouncedCallback } from "use-debounce";
import {
    itemVariants,
    listItemVariants,
    listVariants,
    pageVariants,
} from "@/motion";
import { motion } from "motion/react";
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
    const [filter, setFilter] = useState<JobSortOption>(
        () =>
            (new URLSearchParams(window.location.search).get(
                "filter",
            ) as JobSortOption) ?? "all",
    );

    const allSelected =
        jobs.data.length > 0 && selectedJobIds.length === jobs.data.length;

    function handleToggleAll() {
        if (allSelected) {
            setSelectedJobIds([]);
        } else {
            setSelectedJobIds(jobs.data.map((job) => job.id));
        }
    }

    const handleSearch = useDebouncedCallback((value) => {
        router.get(
            "/admin/job-positions", // Update with your actual route name
            {
                search: value,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }, 300);

    const handleSearchChange = (e) => {
        setSearch(e);
        handleSearch(e);
    };

    const handleFilterChange = (value: JobSortOption) => {
        setFilter(value);

        router.get(
            "/admin/job-positions",
            {
                search: search || undefined,
                filter: value,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <motion.div
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
        >
            {/* Page Header */}
            <motion.div
                variants={itemVariants}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Job Positions
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Reusable roles that can later be assigned to one or more
                        companies.
                    </p>
                </div>
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemVariants}>
                <Separator />
            </motion.div>

            {/* Toolbar */}
            <motion.div variants={itemVariants}>
                <ToolbarJob
                    search={search}
                    onSearchChange={handleSearchChange}
                    selectedCount={selectedJobIds.length}
                    onDeleteSelected={() => setDeleteSelectedOpen(true)}
                    onCreate={() => setCreateOpen(true)}
                    filter={filter}
                    onFilterChange={handleFilterChange}
                />

                <CreateJobDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                />
            </motion.div>

            {/* Job List */}
            <JobList
                allSelected={allSelected}
                onToggleAll={handleToggleAll}
                jobs={jobs.data}
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
                    const params = new URLSearchParams(window.location.search);

                    params.set("page", page);

                    const queryData = Object.fromEntries(params.entries());

                    router.visit(window.location.pathname, {
                        data: queryData,
                        preserveState: true,
                        preserveScroll: true,
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
        </motion.div>
    );
}

Index.layout = (page: React.ReactNode) => <Master>{page}</Master>;
export default Index;
