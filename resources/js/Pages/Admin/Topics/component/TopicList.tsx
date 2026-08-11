import { useState } from "react";
import type { Company } from "../../Types/company";
import type { Topic } from "./TopicCard";
import TopicCard from "./TopicCard";

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
    rectSortingStrategy,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { distance } from "motion/react";
import { MoveDiagonal } from "lucide-react";

interface Props {
    topics: Topic[];
    company: Company;
}

export default function TopicList({ topics, company }: Props) {
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

        if (!over || active.id === "over.id") {
            return;
        }

        console.log("Moved:", active.id, "to:", over.id);
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
                        {topics.map((item) => (
                            <TopicCard
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
