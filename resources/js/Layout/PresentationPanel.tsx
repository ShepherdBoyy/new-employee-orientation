import { usePage } from "@inertiajs/react";
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
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import CreateFolderDialog from "@/Pages/Admin/Folders/components/CreateFolderDialog";
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
    const { props } = usePage<PageProps>();

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

    const [items, setItems] = useState<GridItem[]>(() =>
        buildItems(companyWideFolders),
    );

    useEffect(() => {
        setItems(buildItems(companyWideFolders));
    }, [companyWideFolders, jobSpecificSummary]);

    return (
        <aside className="h-full w-85 shrink-0 rounded-xl flex-1 overflow-auto text-white">
            <div className="p-6">
                <h2 className="font-semibold text-lg">{company.name}</h2>

                <p className="text-sm text-muted-foreground">Presentation</p>
            </div>

            <div className="space-y-2">
                {/* <CreateFolderDialog
                    open={createDialogOpen}
                    onClose={() => setCreateDialogOpen(false)}
                    companyId={company.id}
                /> */}
                <Button variant="ghost" size="lg" className="gap-2">
                    <CirclePlus />
                    New Folder
                </Button>

                {items.map((item) => {
                    if (item.type !== "folder") {
                        return (
                            <div>
                                <Link
                                    key={item.id}
                                    href={`/admin/folders/${company.slug}/job-positions`}
                                >
                                    <Item className="group relative overflow-hidden rounded-xl transition-all duration-200 hover:bg-background">
                                        <ItemMedia>
                                            <UsersRound className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                                        </ItemMedia>

                                        <ItemContent className="ml-2">
                                            <ItemTitle>
                                                {jobSpecificSummary?.name}
                                            </ItemTitle>

                                            <ItemDescription className="text-[11px] text-muted-foreground/50">
                                                {
                                                    jobSpecificSummary?.total_positions
                                                }{" "}
                                                positions
                                            </ItemDescription>
                                        </ItemContent>

                                        <ItemActions className="opacity-0 translate-x-2 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 rounded-lg"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                        }}
                                                    >
                                                        <EllipsisVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent
                                                    align="end"
                                                    className="w-44"
                                                >
                                                    <DropdownMenuItem>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>

                                                    <DropdownMenuSeparator />

                                                    <DropdownMenuItem
                                                        variant="destructive"
                                                        className="text-destructive focus:text-destructive"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </ItemActions>
                                    </Item>
                                </Link>
                            </div>
                        );
                    }
                    const active = activeFolderSlug === item.folder.slug;
                    return (
                        <div>
                            <Link
                                key={item.id}
                                href={`/admin/folders/${company.slug}/${item.folder.slug}`}
                            >
                                <Item
                                    className={cn(
                                        "relative group overflow-hidden rounded-xl transition-all duration-200",
                                        active
                                            ? "bg-background text-black"
                                            : "border-transparent hover:bg-sidebar hover:text-black",
                                    )}
                                >
                                    <ItemMedia>
                                        <Folder
                                            className={cn(
                                                "h-5 w-5 transition-colors",
                                                active
                                                    ? "text-primary"
                                                    : "text-muted-foreground group-hover:text-foreground",
                                            )}
                                        />
                                    </ItemMedia>

                                    <ItemContent className="ml-2">
                                        <ItemTitle className="">
                                            {item.folder.name}
                                        </ItemTitle>

                                        <ItemDescription className="text-[11px] text-muted-foreground/80">
                                            {item.folder.key_topics_count}{" "}
                                            topics
                                        </ItemDescription>
                                    </ItemContent>

                                    <ItemActions
                                        className={cn(
                                            "transition-all duration-200",
                                            active
                                                ? "opacity-100 translate-x-0"
                                                : "opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0",
                                        )}
                                    >
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg"
                                                    onClick={(e) =>
                                                        e.preventDefault()
                                                    }
                                                >
                                                    <EllipsisVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent
                                                align="end"
                                                className="w-44"
                                            >
                                                <DropdownMenuItem>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </ItemActions>
                                </Item>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}
