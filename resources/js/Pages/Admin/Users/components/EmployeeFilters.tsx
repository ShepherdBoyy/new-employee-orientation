import { Search, SearchIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
interface Company {
    id: number;
    name: string;
}

interface EmployeeFiltersProps {
    companies: Company[];
    search: string;
    onSearchChange: (value: string) => void;
    companyFilter: string;
    onCompanyChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
    onClear: () => void;
    hasActiveFilters: boolean;
}
export default function EmployeeFilters({
    companies,
    search,
    onSearchChange,
    companyFilter,
    onCompanyChange,
    statusFilter,
    onStatusChange,
    onClear,
    hasActiveFilters,
}: EmployeeFiltersProps) {
    return (
        <div className="flex flex-col gap-3  bg-card  ">
            {/* Search */}
            <InputGroup className="max-w-2xl h-9">
                <InputGroupInput
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search employees..."
                />
                <InputGroupAddon>
                    <SearchIcon />
                </InputGroupAddon>
            </InputGroup>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <Select value={companyFilter} onValueChange={onCompanyChange}>
                    <SelectTrigger className="h-9  w-65">
                        <SelectValue placeholder="Company" />
                    </SelectTrigger>

                    <SelectContent position="popper">
                        <SelectItem value="all">All companies</SelectItem>

                        {companies.map((company) => (
                            <SelectItem
                                key={company.id}
                                value={String(company.id)}
                            >
                                {company.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={onStatusChange}>
                    <SelectTrigger className="h-9 w-full sm:w-36">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>

                    <SelectContent position="popper">
                        <SelectItem value="all">All statuses</SelectItem>

                        <SelectItem value="not_started">Not started</SelectItem>

                        <SelectItem value="in_progress">In progress</SelectItem>

                        <SelectItem value="acknowledged">
                            Acknowledged
                        </SelectItem>
                    </SelectContent>
                </Select>

                {hasActiveFilters && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        className="h-9 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                        <X className="size-3.5" />
                        Clear filters
                    </Button>
                )}
            </div>
        </div>
    );
}
