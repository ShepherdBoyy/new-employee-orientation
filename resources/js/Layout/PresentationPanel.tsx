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
import { ScrollArea } from "@/components/ui/scroll-area";
import DeleteModuleDialog from "./PresentationPanelComponent/DeleteModuleDialog";
import EditModuleDialog from "./PresentationPanelComponent/EditModuleDialog";

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
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [module, setModule] = useState({});
    const { props, url } = usePage<PageProps>();

    const companyWideFolders = props.companyWideFolders ?? [];
    const jobSpecificSummary = props.jobSpecificSummary ?? null;

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
    const segments = url.split("/");
    const activeModuleSlug = segments[4];

    const items = buildItems(companyWideFolders);
    const jobPositionsPath = `/admin/folders/${company.slug}/job-positions`;
    function openCreate() {
        setCreateDialogOpen(true);
    }
    return (
        <>
            <aside className="flex h-full  shrink-0 flex-col rounded-xl text-white">
                <div className="px-3 pt-4 pb-1 shrink-0">
                    <h2 className="font-medium text-lg tracking-tight">
                        {company.name}
                    </h2>

                    <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-white/60">
                        Presentation
                    </p>
                </div>

                {/* Action */}
                <div className="px-1 shrink-0 pt-4">
                    <Button
                        variant="ghost"
                        size="lg"
                        className="h-10 w-full justify-start gap-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white"
                        onClick={openCreate}
                    >
                        <CirclePlus className="size-5" />
                        <span>Create Module</span>
                    </Button>
                </div>

                <ScrollArea className="mt-2 min-h-0 flex-1">
                    <div className="space-y-1 pb-4 pr-2">
                        {items.map((item) => {
                            const isJobSpecific = item.type === "job-specific";
                            const active = isJobSpecific
                                ? url === jobPositionsPath
                                : item.folder.slug === activeModuleSlug;

                            const href = isJobSpecific
                                ? jobPositionsPath
                                : `/admin/folders/${company.slug}/${item.folder.slug}/`;

                            const title = isJobSpecific
                                ? jobSpecificSummary?.name
                                : item.folder.name;

                            const description = isJobSpecific
                                ? `${jobSpecificSummary?.total_positions ?? 0} positions`
                                : `${item.folder.key_topics_count} topics`;

                            return (
                                <Link
                                    key={item.id}
                                    href={href}
                                    className="block group"
                                >
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
                                                    <DropdownMenuItem
                                                        className="text-xs"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setModule({
                                                                id: item.id,
                                                                name: item
                                                                    .folder
                                                                    .name,
                                                                slug: item
                                                                    .folder
                                                                    .slug,
                                                                companySlug:
                                                                    company.slug,
                                                            });
                                                            setOpenEditDialog(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        <Pencil className="mr-2 h-3.5 w-3.5" />
                                                        Edit
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator />

                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        className="text-xs text-destructive focus:text-destructive"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setModule({
                                                                id: item.id,
                                                                name: item
                                                                    .folder
                                                                    .name,
                                                                slug: item
                                                                    .folder
                                                                    .slug,
                                                                companySlug:
                                                                    company.slug,
                                                            });
                                                            setOpenDeleteDialog(
                                                                true,
                                                            );
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
                            );
                        })}
                    </div>
                </ScrollArea>
            </aside>
            <CreateFolderDialog
                open={createDialogOpen}
                onClose={() => setCreateDialogOpen(false)}
                companyId={company.id}
            />
            <EditModuleDialog
                module={module}
                open={openEditDialog}
                onOpenChange={setOpenEditDialog}
            />
            <DeleteModuleDialog
                module={module}
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
            />
        </>
    );
}
