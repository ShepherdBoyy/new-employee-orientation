import {
    Item,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { Link } from "@inertiajs/react";
import { UsersRound } from "lucide-react";
import type { CompanyNav, JobSpecificSummary } from "../SideBarNav/navTypes";

interface Props {
    company: CompanyNav;
    summary: JobSpecificSummary;
    active: boolean;
}

export default function ModuleJobItem({ company, summary, active }: Props) {
    const href = `/admin/folders/${company.slug}/job-positions`;

    return (
        <Link href={href} className="group block">
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
                        <UsersRound className="h-4 w-4" />
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
            </Item>
        </Link>
    );
}
