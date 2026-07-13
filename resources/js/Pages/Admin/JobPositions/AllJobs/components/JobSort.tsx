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

import { Pin, Building2, Building, ListSortDescending } from "lucide-react";

import type { JobSortOption } from "@/Pages/Admin/Types/job-position";

type Props = {
    sort: JobSortOption;
    onSortChange: (sort: JobSortOption) => void;
};

export default function JobSort({ sort, onSortChange }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-lg">
                    <ListSortDescending />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="min-w-60" align="start">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Sort Job Positions</DropdownMenuLabel>

                    <DropdownMenuRadioGroup
                        value={sort}
                        onValueChange={(value) =>
                            onSortChange(value as JobSortOption)
                        }
                    >
                        <DropdownMenuRadioItem value="assigned">
                            <Pin className="size-4" />
                            Assigned First
                        </DropdownMenuRadioItem>

                        <DropdownMenuRadioItem value="most-companies">
                            <Building2 className="size-4" />
                            Most Companies
                        </DropdownMenuRadioItem>

                        <DropdownMenuRadioItem value="least-companies">
                            <Building className="size-4" />
                            Least Companies
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
