import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import { ListFilter } from "lucide-react";

import type { JobSortOption } from "@/Pages/Admin/Types/job-position";

type Props = {
    sort: JobSortOption;
    onSortChange: (sort: JobSortOption) => void;
};

export default function JobSort({ sort, onSortChange }: Props) {
    const filterLabel = {
        all: "All",
        field: "Field Based",
        non_field: "Non-Field Based",
    }[sort];

    const isFiltered = sort !== "all";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={isFiltered ? "secondary" : "outline"}
                    className="gap-2 h-9"
                >
                    <ListFilter className="size-4" />
                    {filterLabel}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="min-w-55"
                align="start"
                sideOffset={10}
            >
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Filter by job type</DropdownMenuLabel>

                    <DropdownMenuRadioGroup
                        value={sort}
                        onValueChange={(value) =>
                            onSortChange(value as JobSortOption)
                        }
                    >
                        <DropdownMenuRadioItem value="all">
                            All Job Positions
                        </DropdownMenuRadioItem>

                        <DropdownMenuRadioItem value="field">
                            Field Based
                        </DropdownMenuRadioItem>

                        <DropdownMenuRadioItem value="non_field">
                            Non-Field Based
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
