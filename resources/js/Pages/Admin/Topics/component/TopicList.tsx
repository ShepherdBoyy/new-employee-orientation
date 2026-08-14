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

    useEffect(() => {
        setTopics(initalTopics);
    }, [initalTopics]);

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
                    {topics.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                            <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                No topics found
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                                Get started by creating your first topic for
                                this folder.
                            </p>
                        </div>
                    ) : (
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
                    )}
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
