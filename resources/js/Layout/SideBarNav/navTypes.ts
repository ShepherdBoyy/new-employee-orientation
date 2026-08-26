import { ReactNode } from "react";

export type NavItem = {
    group: string;
    links: {
        title: string;
        path: string;
        icon?: ReactNode;
        logo_path?: string | null;
    }[];
};

export interface CompanyNav {
    group: string;
    logo_path: string;
    id: number;
    name: string;
    slug: string;
}

export interface ModuleNav {
    id: number;
    name: string;
    slug: string;
    order: number;
    key_topics_count: number;
}

export interface JobSpecificSummary {
    total_positions: number;
    folders_created: number;
    order: number;
    name: string;
    field_folder_slug: string
}
