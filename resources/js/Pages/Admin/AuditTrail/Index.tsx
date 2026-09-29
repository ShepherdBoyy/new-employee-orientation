import { useState } from "react";
import { router } from "@inertiajs/react";
import { useDebouncedCallback } from "use-debounce";

import Master from "@/Layout/Master";
import AppPagination from "@/Layout/Pagination";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    CalendarDays,
    FileDiff,
    SearchIcon,
    ShieldAlert,
    X,
} from "lucide-react";

interface AuditLogEntry {
    id: number;
    user_name: string | null;
    user_role: string | null;
    action: string;
    subject_type: string | null;
    description: string;
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    ip_address: string | null;
    created_at: string;
}

interface Paginated<T> {
    data: T[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Props {
    logs: Paginated<AuditLogEntry>;
    actions: string[];
    filters: {
        search?: string;
        action?: string;
        date_from?: string;
        date_to?: string;
    };
}

const ACTION_VARIANT: Record<string, string> = {
    created:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    updated: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    deleted: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
    exported:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    logged_in:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    logged_out:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    login_failed:
        "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
};

function actionLabel(action: string): string {
    return action
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

function parseDate(value: string): Date | undefined {
    if (!value) return undefined;

    const [year, month, day] = value.split("-").map(Number);

    if (!year || !month || !day) {
        return undefined;
    }

    return new Date(year, month - 1, day);
}

function formatDateForQuery(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDateLabel(value: string): string {
    const date = parseDate(value);

    if (!date) {
        return "";
    }

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);
}
function formatChangeKey(key: string): string {
    return key
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatChangeValue(value: unknown): string {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (Array.isArray(value)) {
        return value.length > 0 ? value.join(", ") : "—";
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
}

function getChangedFields(log: AuditLogEntry): string[] {
    const keys = new Set([
        ...Object.keys(log.old_values ?? {}),
        ...Object.keys(log.new_values ?? {}),
    ]);

    return Array.from(keys).filter((key) => {
        const oldValue = log.old_values?.[key];
        const newValue = log.new_values?.[key];

        return JSON.stringify(oldValue) !== JSON.stringify(newValue);
    });
}

function AuditTrail({ logs, actions, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [action, setAction] = useState(filters.action ?? "all");
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? "");
    const [dateTo, setDateTo] = useState(filters.date_to ?? "");

    const hasActiveFilters =
        search.trim() !== "" ||
        action !== "all" ||
        dateFrom !== "" ||
        dateTo !== "";

    function applyFilters(next: Partial<Props["filters"]>) {
        router.get(
            "/admin/audit-trail",
            {
                search: next.search ?? search,
                action:
                    (next.action ?? action) === "all"
                        ? undefined
                        : (next.action ?? action),
                date_from: next.date_from ?? dateFrom,
                date_to: next.date_to ?? dateTo,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    const debouncedSearch = useDebouncedCallback((value: string) => {
        applyFilters({ search: value });
    }, 300);

    function handleSearchChange(value: string) {
        setSearch(value);
        debouncedSearch(value);
    }

    function handleActionChange(value: string) {
        setAction(value);
        applyFilters({ action: value });
    }

    function handleDateFromChange(date: Date | undefined) {
        const value = date ? formatDateForQuery(date) : "";

        setDateFrom(value);

        // If the new "from" date is after the existing "to" date,
        // automatically move the "to" date with it.
        if (dateTo && value > dateTo) {
            setDateTo(value);

            applyFilters({
                date_from: value,
                date_to: value,
            });

            return;
        }

        applyFilters({
            date_from: value,
        });
    }

    function handleDateToChange(date: Date | undefined) {
        const value = date ? formatDateForQuery(date) : "";

        setDateTo(value);

        applyFilters({
            date_to: value,
        });
    }

    function clearFilters() {
        setSearch("");
        setAction("all");
        setDateFrom("");
        setDateTo("");

        router.get(
            "/admin/audit-trail",
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    }

    return (
        <div className="w-full space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Audit Trail
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        A chronological, unalterable record of who did what,
                        when, and from where.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-3">
                <InputGroup className="h-9 max-w-2xl">
                    <InputGroupInput
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search by user or description..."
                    />

                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Action */}
                    <Select value={action} onValueChange={handleActionChange}>
                        <SelectTrigger className="h-9 w-48">
                            <SelectValue placeholder="Action" />
                        </SelectTrigger>

                        <SelectContent position="popper">
                            <SelectItem value="all">All actions</SelectItem>

                            {actions.map((a) => (
                                <SelectItem key={a} value={a}>
                                    {actionLabel(a)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Date From */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={[
                                    "h-9 w-44 justify-start gap-2 px-3 text-left font-normal",
                                    !dateFrom && "text-muted-foreground",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            >
                                <CalendarDays className="size-3.5" />

                                {dateFrom
                                    ? formatDateLabel(dateFrom)
                                    : "From date"}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent align="start" className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={parseDate(dateFrom)}
                                onSelect={handleDateFromChange}
                                disabled={{
                                    after: new Date(),
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    <span className="text-sm text-muted-foreground">to</span>

                    {/* Date To */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={[
                                    "h-9 w-44 justify-start gap-2 px-3 text-left font-normal",
                                    !dateTo && "text-muted-foreground",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            >
                                <CalendarDays className="size-3.5" />

                                {dateTo ? formatDateLabel(dateTo) : "To date"}
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent align="start" className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={parseDate(dateTo)}
                                onSelect={handleDateToChange}
                                disabled={{
                                    before: parseDate(dateFrom),
                                    after: new Date(),
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    {/* Clear */}
                    {hasActiveFilters && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="h-9 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
                        >
                            <X className="size-3.5" />
                            Clear filters
                        </Button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead className="w-10" />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {logs.data.length > 0 ? (
                            logs.data.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                                        {log.created_at}
                                    </TableCell>

                                    <TableCell>
                                        <div className="text-sm font-medium">
                                            {log.user_name ?? "System"}
                                        </div>

                                        {log.user_role && (
                                            <div className="text-xs capitalize text-muted-foreground">
                                                {log.user_role}
                                            </div>
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={
                                                ACTION_VARIANT[log.action] ?? ""
                                            }
                                        >
                                            {actionLabel(log.action)}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="max-w-md truncate  ">
                                        {log.description}
                                    </TableCell>

                                    <TableCell className="text-sm text-muted-foreground">
                                        {log.ip_address ?? "—"}
                                    </TableCell>

                                    <TableCell>
                                        {log.action === "updated" &&
                                            (() => {
                                                const changedFields =
                                                    getChangedFields(log);

                                                if (
                                                    changedFields.length === 0
                                                ) {
                                                    return null;
                                                }

                                                return (
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground"
                                                            >
                                                                <FileDiff className="size-3.5" />
                                                                View changes
                                                            </Button>
                                                        </PopoverTrigger>

                                                        <PopoverContent
                                                            align="end"
                                                            className="w-96 p-0"
                                                        >
                                                            <div className="flex max-h-[28rem] flex-col">
                                                                {/* Header */}
                                                                <div className="shrink-0 border-b px-4 py-3">
                                                                    <p className="text-sm font-medium">
                                                                        Changes
                                                                    </p>

                                                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                                                        The
                                                                        fields
                                                                        modified
                                                                        by this
                                                                        update.
                                                                    </p>
                                                                </div>

                                                                {/* Scrollable changes */}
                                                                <div className="min-h-0 overflow-y-auto p-4">
                                                                    <div className="space-y-2">
                                                                        {changedFields.map(
                                                                            (
                                                                                key,
                                                                            ) => {
                                                                                const oldValue =
                                                                                    log
                                                                                        .old_values?.[
                                                                                        key
                                                                                    ];

                                                                                const newValue =
                                                                                    log
                                                                                        .new_values?.[
                                                                                        key
                                                                                    ];

                                                                                return (
                                                                                    <div
                                                                                        key={
                                                                                            key
                                                                                        }
                                                                                        className="rounded-lg border bg-muted/30 p-3"
                                                                                    >
                                                                                        <p className="mb-2 text-xs font-medium">
                                                                                            {formatChangeKey(
                                                                                                key,
                                                                                            )}
                                                                                        </p>

                                                                                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                                                                                            <div className="min-w-0">
                                                                                                <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                                                                                                    Before
                                                                                                </p>

                                                                                                <p className="truncate rounded-md bg-background px-2 py-1.5 text-xs text-muted-foreground">
                                                                                                    {formatChangeValue(
                                                                                                        oldValue,
                                                                                                    )}
                                                                                                </p>
                                                                                            </div>

                                                                                            <span className="text-muted-foreground">
                                                                                                →
                                                                                            </span>

                                                                                            <div className="min-w-0">
                                                                                                <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                                                                                                    After
                                                                                                </p>

                                                                                                <p className="truncate rounded-md bg-background px-2 py-1.5 text-xs font-medium">
                                                                                                    {formatChangeValue(
                                                                                                        newValue,
                                                                                                    )}
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                );
                                                                            },
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                );
                                            })()}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-32 text-center"
                                >
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <ShieldAlert className="size-6" />

                                        <p className="text-sm">
                                            No audit entries found.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {logs.data.length > 0 && (
                <AppPagination
                    from={logs.from}
                    to={logs.to}
                    total={logs.total}
                    currentPage={logs.current_page}
                    lastPage={logs.last_page}
                    onPrevious={logs.prev_page_url}
                    onNext={logs.next_page_url}
                    onPageChange={(page) => {
                        const params = new URLSearchParams(
                            window.location.search,
                        );

                        params.set("page", String(page));

                        router.visit(window.location.pathname, {
                            data: Object.fromEntries(params.entries()),
                            preserveState: true,
                            preserveScroll: true,
                        });
                    }}
                />
            )}
        </div>
    );
}

AuditTrail.layout = (page: React.ReactNode) => <Master>{page}</Master>;

export default AuditTrail;
