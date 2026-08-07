import { usePage } from "@inertiajs/react";
import type {
    CompanyNav,
    JobSpecificSummary,
    ModuleNav,
} from "./SideBarNav/navTypes";

import { SelectedModule } from "./PresentationPanelComponent/ModuleItem";
import { CirclePlus } from "lucide-react";
import CreateFolderDialog from "@/Layout/PresentationPanelComponent/CreateModuleDialog";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeleteModuleDialog from "./PresentationPanelComponent/DeleteModuleDialog";
import EditModuleDialog from "./PresentationPanelComponent/EditModuleDialog";
import ModuleItem from "./PresentationPanelComponent/ModuleItem";
import ModuleJobItem from "./PresentationPanelComponent/ModuleJobItem";
import { useEffect, useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    SortableContext,
    rectSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
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
    const [module, setModule] = useState<SelectedModule | null>(null);
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
                <div className="px-1  flex shrink-0 pt-4 items-center justify-between w-full">
                    <Button
                        variant="ghost"
                        size="lg"
                        className="h-12 w-full justify-start gap-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white"
                        onClick={openCreate}
                    >
                        <CirclePlus className="size-5" />
                        <span>Create Module</span>
                    </Button>
                </div>

                <ScrollArea className="mt-2 min-h-0 flex-1 pr-2">
                    <div className="space-y-1 pb-4 pr-2">
                        {items.map((item) => {
                            if (item.type === "job-specific") {
                                const active = url === jobPositionsPath;

                                if (!jobSpecificSummary) {
                                    return null;
                                }

                                return (
                                    <ModuleJobItem
                                        key={item.id}
                                        company={company}
                                        summary={jobSpecificSummary}
                                        active={active}
                                    />
                                );
                            }

                            const active =
                                item.folder.slug === activeModuleSlug;

                            return (
                                <ModuleItem
                                    key={item.id}
                                    company={company}
                                    module={item.folder}
                                    active={active}
                                    onEdit={(module) => {
                                        setModule(module);
                                        setOpenEditDialog(true);
                                    }}
                                    onDelete={(module) => {
                                        setModule(module);
                                        setOpenDeleteDialog(true);
                                    }}
                                />
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

            {module && (
                <EditModuleDialog
                    module={module}
                    open={openEditDialog}
                    onOpenChange={setOpenEditDialog}
                />
            )}

            {module && (
                <DeleteModuleDialog
                    module={module}
                    open={openDeleteDialog}
                    onOpenChange={setOpenDeleteDialog}
                />
            )}
        </>
    );
}
