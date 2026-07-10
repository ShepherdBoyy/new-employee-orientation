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
type Props = {
    search: string;
    onSearchChange: (value: string) => void;

    allSelected: boolean;
    onToggleAll: () => void;

    selectedCount: number;
    onDeleteSelected: () => void;

    onCreate: () => void;
};
export default function ToolbarJob({
    onCreate,
    search,
    onSearchChange,
    allSelected,
    onToggleAll,
    selectedCount,
    onDeleteSelected,
}: Props) {
    return (
        <>
            <Card>
                <CardContent className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="flex gap-2 items-center">
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
                        <Separator orientation="vertical" />
                        <InputGroup className="max-w-sm">
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

                        <Button onClick={onCreate}>
                            <Plus className="size-4" />
                            New Job
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
