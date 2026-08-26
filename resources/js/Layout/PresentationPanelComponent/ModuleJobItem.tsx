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
import { GripVertical, UsersRound } from "lucide-react";
import type { CompanyNav, JobSpecificSummary } from "../SideBarNav/navTypes";
import { Button } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
    company: CompanyNav;
    summary: JobSpecificSummary;
    active: boolean;
}

export default function ModuleJobItem({ company, summary, active }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: "job-specific",
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
        visibility: isDragging ? ("hidden" as const) : ("visible" as const),
    };

    const href = `/admin/folders/${company.slug}/${summary.field_folder_slug}`;

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
                    href={href}
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
                            {summary.name}
                        </ItemTitle>

                        <ItemDescription
                            className={cn(
                                "mt-0.5 truncate text-[12px]",
                                active ? "text-slate-500" : "text-white/50",
                            )}
                        >
                            {summary.total_positions} positions
                        </ItemDescription>
                    </ItemContent>
                </Link>

                <ItemActions></ItemActions>
            </Item>
        </div>
    );
}