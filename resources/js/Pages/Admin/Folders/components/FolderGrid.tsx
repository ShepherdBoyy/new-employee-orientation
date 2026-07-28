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
import { router } from "@inertiajs/react";
import FolderCard, { type CompanyFolder } from "./FolderCard";
import JobSpecificTile from "./JobSpecificTile";

interface JobSpecificSummary {
    total_positions: number;
    order: number;
    name: string;
    key_topics: string[];
}

type GridItem =
    | { type: "folder"; id: number; folder: CompanyFolder }
    | { type: "job-specific"; id: "job-specific" };

interface Props {
    companyId: number;
    companySlug: string;
    folders: CompanyFolder[];
    jobSpecificSummary: JobSpecificSummary | null;
    onEdit: (folder: CompanyFolder) => void;
    onEditJobSpecific: () => void;
    onDeleteRequest: (folder: CompanyFolder) => void;
}

export default function FolderGrid({
    companyId,
    companySlug,
    folders: initialFolders,
    jobSpecificSummary,
    onEdit,
    onEditJobSpecific,
    onDeleteRequest,
}: Props) {
    const buildItems = (folderList: CompanyFolder[]): GridItem[] => {
        const items: GridItem[] = folderList.map((folder) => ({
            type: "folder",
            id: folder.id,
            folder,
        }));

        if (jobSpecificSummary) {
            const insertAt = folderList.filter(
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
        buildItems(initialFolders),
    );

    useEffect(() => {
        setItems(buildItems(initialFolders));
    }, [initialFolders, jobSpecificSummary]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex);

        setItems(reordered);

        router.patch(
            "/admin/folders/reorder",
            {
                company_id: companyId,
                items: reordered.map((item, index) => ({
                    type: item.type,
                    id: item.type === "folder" ? item.id : null,
                    order: index + 1,
                })),
            },
            { preserveScroll: true },
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
                <p className="text-sm font-medium">No folders yet</p>
                <p className="text-xs text-muted-foreground">
                    Create one to get started.
                </p>
            </div>
        );
    }

    return (
        <DndContext
            id="folders-dnd"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map((i) => i.id)}
                strategy={rectSortingStrategy}
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) =>
                        item.type === "folder" ? (
                            <FolderCard
                                key={item.id}
                                folder={item.folder}
                                onEdit={onEdit}
                                onDeleteRequest={onDeleteRequest}
                            />
                        ) : (
                            <JobSpecificTile
                                key="job-specific"
                                companySlug={companySlug}
                                name={jobSpecificSummary!.name}
                                totalPositions={
                                    jobSpecificSummary!.total_positions
                                }
                                onEdit={onEditJobSpecific}
                            />
                        ),
                    )}
                </div>
            </SortableContext>
        </DndContext>
    );
}
