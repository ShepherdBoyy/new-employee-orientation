import { usePage } from "@inertiajs/react";
import type {
    CompanyNav,
    JobSpecificSummary,
    ModuleNav,
} from "./SideBarNav/navTypes";
import { mockModules } from "./SideBarNav/navTypes";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import { Folder, CirclePlus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

type GridItem =
    | { type: "folder"; id: number; folder: ModuleNav }
    | { type: "job-specific"; id: "job-specific" };

interface PageProps {
    sidebarCompanies: CompanyNav[];
    companyWideFolders?: ModuleNav[];
    jobSpecificSummary: JobSpecificSummary | null;
    activeFolder?: { slug: string };
    [key: string]: unknown;
}

export default function PresentationPanel() {
    const { url, props } = usePage<PageProps>();
    const companies = props.sidebarCompanies ?? [];
    const companyWideFolders = props.companyWideFolders ?? [];
    const jobSpecificSummary = props.jobSpecificSummary ?? null;
    const activeFolderSlug = props.activeFolder?.slug;

    const slug = url.split("/")[3];
    const company = companies.find((c) => c.slug === slug);

    const buildItems = (folders: ModuleNav[]): GridItem[] => {
        const items: GridItem[] = folders.map((folder) => ({
            type: "folder",
            id: folder.id,
            folder,
        }));

        if (jobSpecificSummary) {
            const insertAt = folders.filter(
                (f) => f.order < jobSpecificSummary.order,
            ).length;
            items.splice(insertAt, 0, {
                type: "job-specific",
                id: "job-specific",
            });
        }

        return items;
    };

    const [items, setItems] = useState<GridItem[]>(() =>
        buildItems(companyWideFolders),
    );

    useEffect(() => {
        setItems(buildItems(companyWideFolders));
    }, [companyWideFolders, jobSpecificSummary]);

    if (!company) return null;

    return (
        <aside className="h-full w-80 shrink-0 rounded-xl flex-1">
            <div className="p-4">
                <h2 className="font-semibold text-lg">{company.name}</h2>

                <p className="text-sm text-muted-foreground">Presentation</p>
            </div>

            <div className="space-y-4 mt-4">
                <Button variant="ghost" size="lg" className="gap-2">
                    <CirclePlus />
                    New Module
                </Button>

                {items.map((item) =>
                    item.type === "folder" ? (
                        <Link
                            key={item.id}
                            href={`/admin/folders/${company.slug}/${item.folder.slug}`}
                        >
                            <Item
                                size="xs"
                                className="group rounded-xl transition-all duration-200 hover:bg-amber-100/55 hover:translate-x-1"
                            >
                                <ItemMedia variant="icon">
                                    <Folder className="text-primary" />
                                </ItemMedia>

                                <ItemContent>
                                    <ItemTitle>{item.folder.name}</ItemTitle>

                                    <ItemDescription className="text-xs">
                                        {item.folder.key_topics_count} Topics
                                    </ItemDescription>
                                </ItemContent>

                                <ItemActions className="opacity-0 -translate-x-2 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-destructive  hover:text-destructive"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </ItemActions>
                            </Item>
                        </Link>
                    ) : (
                        <div>yow</div>
                    ),
                )}
            </div>
        </aside>
    );
}
