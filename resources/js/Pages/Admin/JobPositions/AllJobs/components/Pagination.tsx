import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
    from: number;
    to: number;
    total: number;

    currentPage: number;
    lastPage: number;

    onPrevious: () => void;
    onNext: () => void;
    onPageChange: (page: number) => void;
};

export default function AppPagination({
    from,
    to,
    total,
    currentPage,
    lastPage,
    onPrevious,
    onNext,
    onPageChange,
}: Props) {
    return (
        <div className="mt-6 flex-1 items-center justify-between">
            <div>
                <span className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{from}</span>–
                    <span className="font-medium">{to}</span> of{" "}
                    <span className="font-medium">{total}</span> jobs
                </span>
            </div>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious href="#" onClick={onPrevious} />
                    </PaginationItem>

                    {Array.from({ length: lastPage }).map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href="#"
                                isActive={currentPage === index + 1}
                                onClick={() => onPageChange(index + 1)}
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext href="#" onClick={onNext} />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
