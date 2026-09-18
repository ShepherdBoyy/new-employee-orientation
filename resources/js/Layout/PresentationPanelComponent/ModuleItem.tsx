import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { EllipsisVertical, GripVertical, Pencil, Trash2 } from "lucide-react";
import type { CompanyNav, ModuleNav } from "../SideBarNav/navTypes";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface SelectedModule {
    id: number;
    name: string;
    slug: string;
    companySlug: string;
    employee_type: "field" | "non_field" | "both";
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
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: module.id,
    });

    const selectedModule: SelectedModule = {
        id: module.id,
        name: module.name,
        slug: module.slug,
        companySlug: company.slug,
        employee_type: module.employee_type,
    };

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        visibility: isDragging ? ("hidden" as const) : ("visible" as const),
    };

    return (
        <div ref={setNodeRef} style={style}>
            <Item
                className={cn(
                    "relative flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-150",
                    active
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-white/80 hover:bg-white/5 hover:text-white",
                )}
            >
                <ItemMedia>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "h-7 w-7 rounded-md cursor-grab active:cursor-grabbing",
                            active
                                ? "text-slate-600 hover:bg-slate-100"
                                : "text-white/70 hover:bg-white/10 hover:text-white",
                        )}
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical className="h-4 w-4" />
                    </Button>
                </ItemMedia>
                <Link
                    href={`/admin/folders/${company.slug}/${module.slug}`}
                    className="group flex min-w-0 flex-1 items-center"
                >
                    <ItemContent className="ml-3 min-w-0 flex-1">
                        <ItemTitle
                            className={cn(
                                active
                                    ? "font-semibold text-slate-900"
                                    : "font-medium text-white",
                            )}
                        >
                            {module.name}
                        </ItemTitle>

                        <ItemDescription
                            className={cn(
                                "mt-0.5 flex items-center gap-1.5 truncate text-[12px]",
                                active ? "text-slate-500" : "text-white/50",
                            )}
                        >
                            {module.key_topics_count} topics
                        </ItemDescription>
                    </ItemContent>
                </Link>

                <ItemActions>
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
                                    e.preventDefault();
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
                                    e.preventDefault();
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
        </div>
    );
}
