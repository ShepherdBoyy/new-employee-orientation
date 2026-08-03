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

export interface ModuleNav {
    id: number;
    name: string;
    slug: string;
    topics_count: number;
}

export const mockModules: Record<string, ModuleNav[]> = {
    "inmed-corporation": [
        {
            id: 1,
            name: "Company Orientation",
            slug: "company-orientation",
            topics_count: 8,
        },
        {
            id: 2,
            name: "HR Policies",
            slug: "hr-policies",
            topics_count: 12,
        },
        {
            id: 3,
            name: "Safety Training",
            slug: "safety-training",
            topics_count: 6,
        },
        {
            id: 4,
            name: "Company Orientation",
            slug: "company-orientation",
            topics_count: 8,
        },
        {
            id: 5,
            name: "HR Policies",
            slug: "hr-policies",
            topics_count: 12,
        },
        {
            id: 6,
            name: "Safety Training",
            slug: "safety-training",
            topics_count: 6,
        },
        {
            id: 5,
            name: "HR Policies",
            slug: "hr-policies",
            topics_count: 12,
        },
        {
            id: 6,
            name: "Safety Training",
            slug: "safety-training",
            topics_count: 6,
        },
    ],
    "panamed-philippines-inc": [
        {
            id: 1,
            name: "Company Orientation",
            slug: "company-orientation",
            topics_count: 8,
        },
        {
            id: 2,
            name: "HR Policies",
            slug: "hr-policies",
            topics_count: 12,
        },
        {
            id: 3,
            name: "Safety Training",
            slug: "safety-training",
            topics_count: 6,
        },
        {
            id: 4,
            name: "Company Orientation",
            slug: "company-orientation",
            topics_count: 8,
        },
        {
            id: 5,
            name: "HR Policies",
            slug: "hr-policies",
            topics_count: 12,
        },
        {
            id: 6,
            name: "Safety Training",
            slug: "safety-training",
            topics_count: 6,
        },
        {
            id: 5,
            name: "HR Policies",
            slug: "hr-policies",
            topics_count: 12,
        },
        {
            id: 6,
            name: "Safety Training",
            slug: "safety-training",
            topics_count: 6,
        },
    ],

    "progressive-medical-corporation": [
        {
            id: 1,
            name: "Company Orientation",
            slug: "company-orientation",
            topics_count: 8,
        },
        {
            id: 2,
            name: "HR Policies",
            slug: "hr-policies",
            topics_count: 12,
        },
        {
            id: 3,
            name: "Safety Training",
            slug: "safety-training",
            topics_count: 6,
        },
        {
            id: 4,
            name: "Company Orientation",
            slug: "company-orientation",
            topics_count: 8,
        },
        {
            id: 5,
            name: "HR Policies",
            slug: "hr-policies",
            topics_count: 12,
        },
        {
            id: 6,
            name: "Safety Training",
            slug: "safety-training",
            topics_count: 6,
        },
        {
            id: 5,
            name: "HR Policies",
            slug: "hr-policies",
            topics_count: 12,
        },
        {
            id: 6,
            name: "Safety Training",
            slug: "safety-training",
            topics_count: 6,
        },
    ],
    "medbanc-inc": [
        {
            id: 1,
            name: "Company Orientation",
            slug: "company-orientation",
            topics_count: 8,
        },
        {
            id: 2,
            name: "HR Policies",
            slug: "hr-policies",
            topics_count: 12,
        },
        {
            id: 3,
            name: "Safety Training",
            slug: "safety-training",
            topics_count: 6,
        },
        {
            id: 4,
            name: "Company Orientation",
            slug: "company-orientation",
            topics_count: 8,
        },
        {
            id: 5,
            name: "HR Policies",
            slug: "hr-policies",
            topics_count: 12,
        },
        {
            id: 6,
            name: "Safety Training",
            slug: "safety-training",
            topics_count: 6,
        },
        {
            id: 5,
            name: "HR Policies",
            slug: "hr-policies",
            topics_count: 12,
        },
        {
            id: 6,
            name: "Safety Training",
            slug: "safety-training",
            topics_count: 6,
        },
    ],
    "pmc-group-of-companies": [
        {
            id: 1,
            name: "Company Orientation",
            slug: "company-orientation",
            topics_count: 8,
        },
        {
            id: 2,
            name: "HR Policies",
            slug: "hr-policies",
            topics_count: 12,
        },
        {
            id: 3,
            name: "Safety Training",
            slug: "safety-training",
            topics_count: 6,
        },
        {
            id: 4,
            name: "Company Orientation",
            slug: "company-orientation",
            topics_count: 8,
        },
        {
            id: 5,
            name: "HR Policies",
            slug: "hr-policies",
            topics_count: 12,
        },
        {
            id: 6,
            name: "Safety Training",
            slug: "safety-training",
            topics_count: 6,
        },
        {
            id: 5,
            name: "HR Policies",
            slug: "hr-policies",
            topics_count: 12,
        },
        {
            id: 6,
            name: "Safety Training",
            slug: "safety-training",
            topics_count: 6,
        },
    ],
};
