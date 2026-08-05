import { ReactNode } from "react";

export interface NavLinkItem {
    type: "link";
    group: string;
    links: {
        title: string;
        path: string;
        icon?: ReactNode;
        logo_path?: string;
    }[];
}

export interface NavGroupItem {
    type: "group";
    title: string;
    icon: ReactNode;
    items: { title: string; path: string }[];
}

export type NavItem = NavLinkItem | NavGroupItem;

export interface CompanyNav {
    logo_path: string;
    id: number;
    name: string;
    slug: string;
}

interface TopicNav {
    id: number;
    title: string;
    slides_count: number;
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
}
