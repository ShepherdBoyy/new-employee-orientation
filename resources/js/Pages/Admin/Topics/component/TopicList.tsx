import { useEffect, useState } from "react";
import type { Company } from "../../Types/company";
import type { Topic } from "./TopicCard";
import TopicCard from "./TopicCard";
import { router } from "@inertiajs/react";

import EditTopicDialog from "./Dialogs/EditTopicDialog";
import DeleteTopicDialog from "./Dialogs/DeleteTopicDialog";

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";

import {
    arrayMove,
    rectSortingStrategy,
    SortableContext,
} from "@dnd-kit/sortable";

interface Props {
    topics: Topic[];
    company: Company;
    folderId: number;
}

export default function TopicList({
    topics: initalTopics,
    company,
    folderId,
}: Props) {
    const [topics, setTopics] = useState(initalTopics);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    function handleEdit(topic: Topic) {
        setSelectedTopic(topic);
        setOpenEditDialog(true);
    }

    function handleDelete(topic: Topic) {
        setSelectedTopic(topic);
        setOpenDeleteDialog(true);
    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 6,
            },
        }),
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = topics.findIndex((t) => t.id === active.id);
        const newIndex = topics.findIndex((t) => t.id === over.id);
        const reordered = arrayMove(topics, oldIndex, newIndex);

        setTopics(reordered);

        router.patch(
            `/admin/folders/${folderId}/topics/reorder`,
            {
                topics: reordered.map((topic, index) => ({
                    id: topic.id,
                    order: index + 1,
                })),
            },
            { preserveScroll: true },
        );
    }
    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={topics.map((topic) => topic.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-2 gap-2">
                        {topics.map((item, index) => (
                            <TopicCard
                                index={index}
                                key={item.id}
                                topic={item}
                                company={company}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {selectedTopic && (
                <EditTopicDialog
                    topic={selectedTopic}
                    open={openEditDialog}
                    onOpenChange={setOpenEditDialog}
                />
            )}

            {selectedTopic && (
                <DeleteTopicDialog
                    topic={selectedTopic}
                    open={openDeleteDialog}
                    onOpenChange={setOpenDeleteDialog}
                />
            )}
        </>
    );
}
