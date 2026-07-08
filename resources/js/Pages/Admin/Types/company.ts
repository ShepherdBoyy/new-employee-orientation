import type { JobPosition } from "./job-position";

export interface Company {
    id: number;
    name: string;
    slug: string;
    logo_path: string | null;
    status: "active" | "inactive";
    users_count?: number;
}
export interface CompanyWithJobs extends Company {
    jobs: JobPosition[];
}
