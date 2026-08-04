import { usePage } from "@inertiajs/react";
import type { CompanyNav } from "./SideBarNav/navTypes";
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
export default function PresentationPanel() {
    const { url, props } = usePage();

    const companies = props.sidebarCompanies as CompanyNav[];

    const slug = url.split("/")[3];

    const company = companies.find((c) => c.slug === slug);

    if (!company) return null;

    const modules = mockModules[company.slug] ?? [];

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

                {modules.map((module) => (
                    <Link
                        key={module.id}
                        href={`/admin/folders/${company.slug}/${module.slug}`}
                    >
                        <Item
                            size="xs"
                            className="group rounded-xl transition-all duration-200 hover:bg-amber-100/55 hover:translate-x-1"
                        >
                            <ItemMedia variant="icon">
                                <Folder className="text-primary" />
                            </ItemMedia>

                            <ItemContent>
                                <ItemTitle>{module.name}</ItemTitle>

                                <ItemDescription className="text-xs">
                                    {module.topics_count} Topics
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
                ))}
            </div>
        </aside>
    );
}
