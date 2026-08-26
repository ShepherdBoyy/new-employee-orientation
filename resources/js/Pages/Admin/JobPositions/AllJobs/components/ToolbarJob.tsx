import { Button } from "@/components/ui/button";
import { Plus, SearchIcon, Trash, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import type { JobSortOption } from "@/Pages/Admin/Types/job-position";
import JobSort from "./JobSort";

type Props = {
    search: string;
    onSearchChange: (value: string) => void;

    selectedCount: number;
    onDeleteSelected: () => void;

    onCreate: () => void;

    filter: JobSortOption;
    onFilterChange: (filter: JobSortOption) => void;
};
export default function ToolbarJob({
    onCreate,
    search,
    onSearchChange,
    selectedCount,
    onDeleteSelected,
    filter,
    onFilterChange,
}: Props) {
    const hasFilter = filter !== "all";

    const filterLabel =
        filter === "field_based"
            ? "Field Based"
            : filter === "non_field"
              ? "Non-Field Based"
              : null;

    return (
        <div className="flex items-center justify-between gap-4 py-4">
            <InputGroup className="h-9 max-w-2xl">
                <InputGroupInput
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search job positions..."
                />

                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
            </InputGroup>

            <div className="flex items-center gap-2">
                {selectedCount > 0 && (
                    <>
                        <span className="text-sm text-muted-foreground">
                            {selectedCount} selected
                        </span>

                        <Button
                            variant="destructive"
                            onClick={onDeleteSelected}
                        >
                            <Trash />
                            Delete {selectedCount} jobs
                        </Button>
                    </>
                )}

                <JobSort sort={filter} onSortChange={onFilterChange} />

                {hasFilter && filterLabel && (
                    <Badge
                        variant="secondary"
                        className="h-9 gap-1 rounded-md px-3"
                    >
                        {filterLabel}

                        <button
                            type="button"
                            onClick={() => onFilterChange("all")}
                            className="ml-1 rounded-sm opacity-60 transition-opacity hover:opacity-100"
                            aria-label={`Clear ${filterLabel} filter`}
                        >
                            <X className="size-3.5" />
                        </button>
                    </Badge>
                )}

                <Button size="lg" onClick={onCreate}>
                    <Plus className="size-4" />
                    New Job Position
                </Button>
            </div>
        </div>
    );
}
