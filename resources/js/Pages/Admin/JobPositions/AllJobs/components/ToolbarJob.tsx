import { Button } from "@/components/ui/button";
import { Plus, SearchIcon, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
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

    allSelected: boolean;
    onToggleAll: () => void;

    selectedCount: number;
    onDeleteSelected: () => void;

    onCreate: () => void;
    sort: JobSortOption;
    onSortChange: (sort: JobSortOption) => void;
};
export default function ToolbarJob({
    onCreate,
    search,
    onSearchChange,
    allSelected,
    onToggleAll,
    selectedCount,
    onDeleteSelected,
    sort,
    onSortChange,
}: Props) {
    return (
        <>
            <div className="flex items-center justify-between gap-4 py-4">
                <div className="flex items-center gap-3 flex-1">
                    <Button size="lg" onClick={onCreate}>
                        <Plus className="size-4" />
                        New Job
                    </Button>

                    <div className="flex gap-3 items-center">
                        <JobSort sort={sort} onSortChange={onSortChange} />
                        <Separator orientation="vertical" />

                        <div className="flex items-center gap-2 shrink-0">
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={onToggleAll}
                            />

                            <span className="text-sm text-muted-foreground">
                                Select all
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {selectedCount > 0 && (
                        <span className="text-sm text-muted-foreground">
                            ({selectedCount} selected)
                        </span>
                    )}
                    {selectedCount > 0 && (
                        <Button
                            variant="destructive"
                            onClick={onDeleteSelected}
                        >
                            <Trash />
                            Delete {selectedCount} jobs
                        </Button>
                    )}
                </div>
                <InputGroup className="max-w-sm h-9">
                    <InputGroupInput
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search job positions..."
                    />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </>
    );
}
