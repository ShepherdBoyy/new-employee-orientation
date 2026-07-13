import type { Company } from "./company";

export type JobPosition = {
    id: number;
    name: string;
    companies?: Company[];
    companies_count?: number;
};

export type JobSortOption = "assigned" | "most-companies" | "least-companies";
