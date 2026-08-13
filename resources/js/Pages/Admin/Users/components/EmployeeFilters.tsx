import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
        <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search employees..."
                    className="h-9 border-0 bg-muted/40 pl-9 shadow-none focus-visible:ring-1"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
                <Select value={companyFilter} onValueChange={onCompanyChange}>
                    <SelectTrigger className="h-9 w-full sm:w-40">
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
