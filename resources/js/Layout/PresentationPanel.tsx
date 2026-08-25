import { router, usePage } from "@inertiajs/react";
import type {
    CompanyNav,
    JobSpecificSummary,
    ModuleNav,
} from "./SideBarNav/navTypes";
import { SelectedModule } from "./PresentationPanelComponent/ModuleItem";
import { CirclePlus } from "lucide-react";
import CreateFolderDialog from "@/Layout/PresentationPanelComponent/CreateModuleDialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeleteModuleDialog from "./PresentationPanelComponent/DeleteModuleDialog";
import EditModuleDialog from "./PresentationPanelComponent/EditModuleDialog";
import ModuleItem from "./PresentationPanelComponent/ModuleItem";
import ModuleJobItem from "./PresentationPanelComponent/ModuleJobItem";
import { useCallback, useEffect, useState } from "react";
import {
    DndContext,
    DragOverlay,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type GridItem =
    | { type: "folder"; id: number; folder: ModuleNav }
    | { type: "job-specific"; id: "job-specific" };

export interface PageProps {
    company: CompanyNav;
    companyWideFolders?: ModuleNav[];
    jobSpecificSummary: JobSpecificSummary | null;
    activeFolder?: { slug: string; is_type_specific ?: boolean };
    [key: string]: unknown;
}

export default function PresentationPanel() {
    const { props, url } = usePage<PageProps>();

    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [activeItem, setActiveItem] = useState<GridItem | null>(null);
    const [module, setModule] = useState<SelectedModule | null>(null);

    const companyWideFolders = props.companyWideFolders;
    const jobSpecificSummary = props.jobSpecificSummary;
    const company = props.company;

    const buildItems = useCallback(
        (folders: ModuleNav[]): GridItem[] => {
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
        },
        [jobSpecificSummary],
    );

    const segments = url.split("/");
    const activeModuleSlug = segments[4];
    const [items, setItems] = useState<GridItem[]>(() =>
        buildItems(companyWideFolders ?? []),
    );

    useEffect(() => {
        setItems(buildItems(companyWideFolders ?? []));
    }, [companyWideFolders, buildItems]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 6,
            },
        }),
    );

    function handleDragStart(event: DragStartEvent) {
        const item = items.find((i) => i.id === event.active.id);
        setActiveItem(item ?? null);
    }

    function handleDragEnd(event: DragEndEvent) {
        setActiveItem(null);
        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);

        setItems(reordered);

        router.patch(
            "/admin/folders/reorder",
            {
                company_id: company.id,
                items: reordered.map((item, index) => ({
                    type: item.type,
                    id: item.type === "folder" ? item.id : null,
                    order: index + 1,
                })),
            },
            { preserveScroll: true },
        );
    }

    function handleDragCancel() {
        setActiveItem(null);
    }

    function openCreate() {
        setCreateDialogOpen(true);
    }

    if (!company) return null;

    const jobPositionsPath = `/admin/folders/${company.slug}/job-positions`;
    const isJobSpecificActive =
        url === jobPositionsPath ||
        props.activeFolder?.is_type_specific === true;

    return (
        <>
            <aside className="flex h-full w-125 shrink-0 flex-col rounded-xl text-white">
                <div className="px-3 pt-4 pb-1 shrink-0 flex justify-between items-center">
                    <div>
                        <h2 className="font-medium text-lg tracking-tight">
                            {company.name}
                        </h2>

                        <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-white/60">
                            Presentation
                        </p>
                    </div>

                    <Button
                        variant="secondary"
                        className="px-3"
                        onClick={() =>
                            router.visit(
                                `/admin/folders/preview-list?company_id=${company.id}`,
                            )
                        }
                    >
                        Preview Modules
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            aria-label="A pair of eyes"
                            viewBox="-0.0 -31.0 285.0 285.0"
                        >
                            <g transform="translate(0.000000,223.000000) scale(0.100000,-0.100000)">
                                <path
                                    d="M635 2039 c-121 -29 -235 -116 -288 -220 -29 -57 -36 -114 -15 -121
                                7 -3 49 28 94 68 94 84 105 90 193 115 74 21 212 26 258 8 52 -20 92 -19 98 2
                                20 62 -107 147 -230 154 -38 2 -88 0 -110 -6z M2015 2021 c-99 -34 -155 -81
                                -155 -129 0 -24 0 -24 63 -16 34 5 110 9 168 8 101 0 109 -2 183 -37 52 -25
                                99 -57 141 -98 55 -52 67 -60 80 -49 18 15 19 30 3 84 -9 28 -36 66 -87 118
                                -69 73 -79 80 -153 103 -79 25 -195 33 -243 16z M640 1695 c-109 -34 -213
                                -110 -285 -208 -25 -34 -50 -68 -56 -75 -13 -16 -59 -115 -64 -139 -2 -10 -13
                                -52 -25 -93 -43 -148 -35 -403 16 -525 8 -19 11 -35 8 -35 -4 0 -1 -7 6 -15 7
                                -8 10 -15 6 -15 -12 0 47 -105 90 -161 162 -211 365 -286 579 -214 42 14 96
                                39 119 55 79 55 159 151 205 245 24 50 48 98 53 108 5 10 11 35 14 55 2 20 9
                                62 16 92 16 77 15 260 -2 350 -7 41 -13 78 -12 82 4 15 -61 165 -95 222 -47
                                76 -170 199 -230 230 -110 55 -245 71 -343 41z m195 -55 c0 -1 13 -3 29 -5 33
                                -4 121 -56 176 -103 180 -153 275 -498 215 -778 -15 -71 -78 -232 -101 -259
                                -89 -106 -111 -130 -161 -166 -82 -61 -150 -82 -249 -77 -68 4 -93 10 -150 39
                                -244 123 -394 462 -344 779 31 192 140 397 257 483 52 37 124 76 160 86 18 5
                                168 5 168 1z M790 1210 c-68 -37 -111 -85 -153 -169 -30 -62 -32 -72 -32 -176
                                0 -102 3 -115 31 -175 42 -88 74 -123 146 -159 76 -38 133 -40 204 -7 136 63
                                220 244 194 413 -37 231 -225 362 -390 273z m29 -80 c52 -27 47 -117 -10 -165
                                -56 -46 -99 -22 -99 55 0 51 25 95 64 110 28 11 25 11 45 0z M1960 1681 c-89
                                -29 -138 -58 -212 -129 -94 -90 -192 -269 -204 -375 -3 -23 -9 -60 -14 -82
                                -12 -52 -12 -258 0 -310 5 -22 11 -58 14 -81 2 -23 17 -70 31 -105 91 -216
                                211 -338 386 -394 92 -29 160 -31 243 -10 135 35 229 104 321 236 55 78 92
                                149 79 149 -4 0 -1 7 6 15 7 8 10 15 7 15 -3 0 3 25 13 55 47 136 51 357 10
                                510 -12 44 -23 87 -25 95 -5 24 -55 134 -64 140 -4 3 -21 25 -38 51 -71 104
                                -199 199 -308 228 -60 16 -182 12 -245 -8z m290 -76 c128 -65 201 -143 270
                                -287 125 -261 116 -553 -24 -804 -90 -162 -253 -273 -402 -274 -108 0 -254 80
                                -340 187 -22 26 -45 54 -52 61 -21 23 -38 62 -78 182 -37 113 -38 118 -38 265
                                -1 162 8 207 63 352 34 86 49 108 135 200 110 117 192 155 326 150 70 -3 95
                                -9 140 -32z M2153 1219 c-18 -5 -62 -37 -97 -70 -70 -65 -98 -120 -118 -231
                                -19 -107 22 -248 98 -336 17 -21 58 -50 90 -66 49 -24 66 -28 111 -23 65 7
                                145 49 182 96 26 33 67 106 70 124 1 4 1 8 2 10 14 44 19 193 8 259 -16 91
                                -92 192 -172 229 -45 20 -120 23 -174 8z m12 -114 c31 -30 32 -69 4 -115 -28
                                -45 -46 -58 -75 -52 -27 5 -64 38 -64 57 0 35 35 98 64 116 39 24 42 24 71 -6z"
                                ></path>
                            </g>
                        </svg>
                    </Button>
                </div>

                {/* Action */}
                <div className="px-1 flex shrink-0 pt-4 items-center justify-between w-full">
                    <Button
                        variant="ghost"
                        size="lg"
                        className="h-12 w-full justify-start gap-2 rounded-lg text-white/90 hover:bg-white/10 hover:text-white"
                        onClick={openCreate}
                    >
                        <CirclePlus className="size-5" />
                        Create Module
                    </Button>
                </div>

                <ScrollArea className="mt-2 min-h-0 flex-1 pr-2">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragCancel={handleDragCancel}
                    >
                        <SortableContext
                            items={items.map((item) => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-1 pb-4 pr-2">
                                {items.map((item) => {
                                    if (item.type === "job-specific") {
                                        if (!jobSpecificSummary) {
                                            return null;
                                        }

                                        return (
                                            <ModuleJobItem
                                                key={item.id}
                                                company={company}
                                                summary={jobSpecificSummary}
                                                active={isJobSpecificActive}
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
                        </SortableContext>

                        <DragOverlay
                            dropAnimation={{ duration: 180, easing: "ease" }}
                        >
                            {activeItem ? (
                                activeItem.type === "job-specific" ? (
                                    jobSpecificSummary && (
                                        <div className="shadow-2xl rounded-lg">
                                            <ModuleJobItem
                                                company={company}
                                                summary={jobSpecificSummary}
                                                active={false}
                                            />
                                        </div>
                                    )
                                ) : (
                                    <div className="shadow-2xl rounded-lg">
                                        <ModuleItem
                                            company={company}
                                            module={activeItem.folder}
                                            active={false}
                                            onEdit={() => {}}
                                            onDelete={() => {}}
                                        />
                                    </div>
                                )
                            ) : null}
                        </DragOverlay>
                    </DndContext>
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
