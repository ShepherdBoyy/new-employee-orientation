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
import { Folder } from "lucide-react";
export default function PresentationPanel() {
    const { url, props } = usePage();

    const companies = props.sidebarCompanies as CompanyNav[];

    const slug = url.split("/")[3];

    const company = companies.find((c) => c.slug === slug);

    if (!company) return null;

    const modules = mockModules[company.slug] ?? [];

    return (
        <aside className="w-80 min-h-dvh flex-1 shrink-0 rounded-lg bg-[#FEFEFA]">
            <div className="p-6">
                <h2 className="font-semibold">{company.name}</h2>

                <p className="text-sm text-muted-foreground">Presentation</p>
            </div>
            <div className="space-y-2 px-4">
                {modules.map((module) => (
                    <Item
                        key={module.id}
                        size="sm"
                        className="transition-all
                        duration-200
                        rounded-lg
                        hover:bg-amber-100/50
                        hover:translate-x-1"
                    >
                        <ItemMedia variant="icon">
                            <Folder />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>{module.name}</ItemTitle>
                            <ItemDescription>
                                {module.topics_count} Topics
                            </ItemDescription>
                        </ItemContent>
                        <ItemActions></ItemActions>
                    </Item>
                ))}
            </div>
        </aside>
    );
}
