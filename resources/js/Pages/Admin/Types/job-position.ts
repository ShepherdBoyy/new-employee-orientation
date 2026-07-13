import type { Company } from "./company";

export type JobPosition = {
    id: number;
    name: string;
    companies?: Company[];
    companies_count?: number;
};

export type JobSortOption = "assigned" | "most-companies" | "least-companies";

export interface Paginated<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    to: number;
    from: number;
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}
