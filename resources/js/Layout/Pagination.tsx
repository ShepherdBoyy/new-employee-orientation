import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { router } from "@inertiajs/react";

type Props = {
    from: number;
    to: number;
    total: number;

    currentPage: number;
    lastPage: number;

    perPage: number;
    perPageOptions?: number[];

    onPrevious: string | null;
    onNext: string | null;

    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
};

export default function AppPagination({
    from,
    to,
    total,
    currentPage,
    lastPage,
    perPage,
    perPageOptions = [10, 25, 50, 100],
    onPrevious,
    onNext,
    onPageChange,
    onPerPageChange,
}: Props) {
    const getPageNumbers = () => {
        if (lastPage <= 7) {
            return Array.from({ length: lastPage }, (_, index) => index + 1);
        }

        const pages: (number | "ellipsis")[] = [];

        // Always show first page
        pages.push(1);

        if (currentPage > 4) {
            pages.push("ellipsis");
        }

        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(lastPage - 1, currentPage + 1);

        for (let page = startPage; page <= endPage; page++) {
            pages.push(page);
        }

        if (currentPage < lastPage - 3) {
            pages.push("ellipsis");
        }

        // Always show last page
        pages.push(lastPage);

        return pages;
    };

    const pageNumbers = getPageNumbers();

    const handlePageChange = (page: number) => {
        if (page === currentPage) return;

        onPageChange(page);
    };

    const handlePrevious = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        if (!onPrevious) return;

        router.visit(onPrevious, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleNext = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        if (!onNext) return;

        router.visit(onNext, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="flex flex-col gap-4 pt-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Showing */}
            <div className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">{from}</span>–
                <span className="font-medium text-foreground">{to}</span> of{" "}
                <span className="font-medium text-foreground">{total}</span>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4 sm:justify-end">
                {/* Rows per page */}
                <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap text-sm text-muted-foreground">
                        Rows per page
                    </span>

                    <Select
                        value={String(perPage)}
                        onValueChange={(value) =>
                            onPerPageChange(Number(value))
                        }
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent popover="hint">
                            {perPageOptions.map((option) => (
                                <SelectItem key={option} value={String(option)}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Pagination */}
                <Pagination className="w-auto">
                    <PaginationContent>
                        {/* Previous */}
                        <PaginationItem>
                            <PaginationPrevious
                                href={onPrevious ?? "#"}
                                onClick={handlePrevious}
                                className={
                                    !onPrevious
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>

                        {/* Page numbers */}
                        {pageNumbers.map((page, index) => {
                            if (page === "ellipsis") {
                                return (
                                    <PaginationItem key={`ellipsis-${index}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }

                            return (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href="#"
                                        isActive={currentPage === page}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            handlePageChange(page);
                                        }}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        })}

                        {/* Next */}
                        <PaginationItem>
                            <PaginationNext
                                href={onNext ?? "#"}
                                onClick={handleNext}
                                className={
                                    !onNext
                                        ? "pointer-events-none opacity-50"
                                        : ""
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
