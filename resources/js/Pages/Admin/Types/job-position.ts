import type { Company } from "./company";

export type JobPosition = {
    id: number;
    name: string;
    employee_type: string;
    companies?: Company[];
    companies_count?: number;
};
export type JobSortOption = "all" | "field" | "non_field";
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
    prev_page_url: string;
    next_page_url: string;
}
