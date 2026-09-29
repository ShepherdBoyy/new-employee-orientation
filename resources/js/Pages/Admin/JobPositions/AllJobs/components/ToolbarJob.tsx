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
        filter === "field"
            ? "Field Based"
            : filter === "non_field"
              ? "Non-Field Based"
              : null;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-3">
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
                <JobSort sort={filter} onSortChange={onFilterChange} />
                <div className="flex items-center gap-1">
                    {hasFilter && filterLabel && (
                        <Button
                            variant="ghost"
                            className="h-9 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
                            onClick={() => onFilterChange("all")}
                        >
                            <X className="size-3.5" />
                            Clear filters
                        </Button>
                    )}
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
                </div>
            </div>
            <Button size="lg" onClick={onCreate}>
                <Plus className="size-4" />
                New Job Position
            </Button>
        </div>
    );
}
