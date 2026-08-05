import { usePage } from "@inertiajs/react";
import { useState } from "react";
import type {
    CompanyNav,
    JobSpecificSummary,
    ModuleNav,
} from "./SideBarNav/navTypes";
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Folder,
    CirclePlus,
    Pencil,
    Trash2,
    UsersRound,
    EllipsisVertical,
} from "lucide-react";
import CreateFolderDialog from "@/Pages/Admin/Folders/components/CreateFolderDialog";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";

type GridItem =
    | { type: "folder"; id: number; folder: ModuleNav }
    | { type: "job-specific"; id: "job-specific" };

export interface PageProps {
    company: CompanyNav;
    companyWideFolders?: ModuleNav[];
    jobSpecificSummary: JobSpecificSummary | null;
    activeFolder?: { slug: string };
    [key: string]: unknown;
}

export default function PresentationPanel() {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const { props, url } = usePage<PageProps>();

    const companyWideFolders = props.companyWideFolders ?? [];
    const jobSpecificSummary = props.jobSpecificSummary ?? null;
    const activeFolderSlug = props.activeFolder?.slug;
    const company = props.company;

    if (!company) return null;

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

    const items = buildItems(companyWideFolders);
    const jobPositionsPath = `/admin/folders/${company.slug}/job-positions`;

    function openCreate() {
        setCreateDialogOpen(true);
    }
    return (
        <aside className="h-full  rounded-xl flex-1 overflow-auto text-white flex flex-col space-y-3">
            <div className="px-3 pt-3 pb-1">
                <h2 className="font-medium text-lg tracking-tight">
                    {company.name}
                </h2>
                <p className="text-xs text-white/60 font-medium uppercase tracking-wider mt-0.5">
                    Presentation
                </p>
            </div>

            <div className="px-1">
                <Button
                    variant="ghost"
                    size="lg"
                    className="w-full justify-start gap-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg h-10"
                    onClick={() => openCreate()}
                >
                    <CirclePlus
                        absoluteStrokeWidth
                        strokeWidth={1.7}
                        className="size-5 text-white"
                    />
                    <span className="font-medium">Create Module</span>
                </Button>
                <CreateFolderDialog
                    open={createDialogOpen}
                    onClose={() => setCreateDialogOpen(false)}
                    companyId={company.id}
                />
            </div>

            <div className="space-y-1 overflow-y-auto flex-1">
                {items.map((item) => {
                    const isJobSpecific = item.type === "job-specific";
                    const active = isJobSpecific
                        ? url === jobPositionsPath
                        : activeFolderSlug === item.folder.slug;

                    const href = isJobSpecific
                        ? jobPositionsPath
                        : `/admin/folders/${company.slug}/${item.folder.slug}`;

                    const title = isJobSpecific
                        ? jobSpecificSummary?.name
                        : item.folder.name;

                    const description = isJobSpecific
                        ? `${jobSpecificSummary?.total_positions ?? 0} positions`
                        : `${item.folder.key_topics_count} topics`;

                    return (
                        <Link key={item.id} href={href} className="block group">
                            <Item
                                className={cn(
                                    "relative flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150",
                                    active
                                        ? "bg-white text-slate-900 shadow-sm"
                                        : "border-transparent hover:bg-white/5 text-white/80 hover:text-white",
                                )}
                            >
                                <ItemMedia>
                                    <div
                                        className={cn(
                                            "p-2 rounded-lg transition-colors",
                                            active
                                                ? "bg-primary/10 text-primary"
                                                : "bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white",
                                        )}
                                    >
                                        {isJobSpecific ? (
                                            <UsersRound className="h-4 w-4" />
                                        ) : (
                                            <Folder className="h-4 w-4" />
                                        )}
                                    </div>
                                </ItemMedia>

                                <ItemContent className="ml-3 min-w-0 flex-1">
                                    <ItemTitle
                                        className={cn(
                                            " truncate",
                                            active
                                                ? "font-semibold text-slate-900"
                                                : "font-medium text-white",
                                        )}
                                    >
                                        {title}
                                    </ItemTitle>

                                    <ItemDescription
                                        className={cn(
                                            "text-[12px] truncate mt-0.5",
                                            active
                                                ? "text-slate-500"
                                                : "text-white/50",
                                        )}
                                    >
                                        {description}
                                    </ItemDescription>
                                </ItemContent>

                                <ItemActions
                                    className={cn(
                                        "shrink-0 ml-2 transition-opacity duration-150",
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
                                                        ? "hover:bg-slate-100 text-slate-600"
                                                        : "hover:bg-white/10 text-white/70 hover:text-white",
                                                )}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                }}
                                            >
                                                <EllipsisVertical className="h-3.5 w-3.5" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent
                                            align="end"
                                            className="w-40 shadow-lg"
                                        >
                                            <DropdownMenuItem className="text-xs">
                                                <Pencil className="mr-2 h-3.5 w-3.5" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                variant="destructive"
                                                className="text-xs text-destructive focus:text-destructive"
                                            >
                                                <Trash2 className="mr-2 h-3.5 w-3.5" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </ItemActions>
                            </Item>
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}
