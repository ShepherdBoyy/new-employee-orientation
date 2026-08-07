import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import type { ModuleNav, CompanyNav } from "../SideBarNav/navTypes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@inertiajs/react";
import { EllipsisVertical, Folder, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SelectedModule {
    id: number;
    name: string;
    slug: string;
    companySlug: string;
}

interface Props {
    company: CompanyNav;
    module: ModuleNav;
    onEdit: (module: SelectedModule) => void;
    onDelete: (module: SelectedModule) => void;
    active: boolean;
}

export default function ModuleItem({
    company,
    module,
    onDelete,
    onEdit,
    active,
}: Props) {
    const selectedModule = {
        id: module?.id,
        name: module?.name,
        slug: module?.slug,
        companySlug: company.slug,
    };
    return (
        <>
            <Link
                href={`/admin/folders/${company.slug}/${module?.slug}`}
                className="group block"
            >
                <Item
                    className={cn(
                        "relative flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-150",
                        active
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-white/80 hover:bg-white/5 hover:text-white",
                    )}
                >
                    <ItemMedia>
                        <div
                            className={cn(
                                "rounded-lg p-2 transition-colors",
                                active
                                    ? "bg-primary/10 text-primary"
                                    : "bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white",
                            )}
                        >
                            <Folder className="h-4 w-4" />
                        </div>
                    </ItemMedia>

                    <ItemContent className="ml-3 min-w-0 flex-1">
                        <ItemTitle
                            className={cn(
                                active
                                    ? "font-semibold text-slate-900"
                                    : "font-medium text-white",
                            )}
                        >
                            {module?.name}
                        </ItemTitle>

                        <ItemDescription
                            className={cn(
                                "mt-0.5 truncate text-[12px]",
                                active ? "text-slate-500" : "text-white/50",
                            )}
                        >
                            {module?.key_topics_count} topics
                        </ItemDescription>
                    </ItemContent>
                    <ItemActions
                        className={cn(
                            "ml-2 shrink-0 transition-opacity duration-150",
                            active
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100",
                        )}
                    >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "h-7 w-7 rounded-md",
                                        active
                                            ? "text-slate-600 hover:bg-slate-100"
                                            : "text-white/70 hover:bg-white/10 hover:text-white",
                                    )}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                >
                                    <EllipsisVertical className="h-3.5 w-3.5" />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                    className="text-xs"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(selectedModule);
                                    }}
                                >
                                    <Pencil className="mr-2 h-3.5 w-3.5" />
                                    Edit
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    variant="destructive"
                                    className="text-xs"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(selectedModule);
                                    }}
                                >
                                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </ItemActions>
                </Item>
            </Link>
        </>
    );
}
