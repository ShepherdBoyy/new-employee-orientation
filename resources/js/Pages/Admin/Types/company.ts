import type { JobPosition } from "./job-position";

export const COMPANY_THEMES = {
    default: "bg-gradient-to-r from-blue-600 to-blue-500",
    lush_fields: "bg-gradient-to-r from-[#5DA92F] to-[#9BD46A]",

    ocean_dust: "bg-gradient-to-r from-[#9BB2E5] to-[#698CBF]",

    orange_heat: "bg-gradient-to-r from-[#F64C18] to-[#EE9539]",

    void_spark: "bg-gradient-to-r from-[#000328] to-[#00458E]",

    lime_rush: "bg-gradient-to-r from-[#51C26F] to-[#F2E901]",

    frosted_light: "bg-gradient-to-r from-[#EBF4F5] to-[#B5C6E0]",
} as const;
export interface Company {
    id: number;
    name: string;
    slug: string;
    logo_path: string | null;
    status: "active" | "inactive";
    header_theme?: keyof typeof COMPANY_THEMES;

    users_count?: number;
}
export interface CompanyWithJobs extends Company {
    jobs: JobPosition[];
}
export interface CompanyWithJobCount extends Company {
    jobs_count: number;
}
