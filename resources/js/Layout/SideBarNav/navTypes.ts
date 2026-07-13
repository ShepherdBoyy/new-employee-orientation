import { ReactNode } from "react";

export interface NavLinkItem {
    type: "link";
    title: string;
    path: string;
    icon: ReactNode;
}

export interface NavGroupItem {
    type: "group";
    title: string;
    icon: ReactNode;
    items: { title: string; path: string }[];
}

export type NavItem = NavLinkItem | NavGroupItem;

export interface CompanyNav {
    id: number;
    name: string;
    slug: string;
}
