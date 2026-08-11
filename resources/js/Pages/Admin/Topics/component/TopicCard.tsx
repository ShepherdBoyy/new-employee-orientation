import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import {
    Pencil,
    Trash2,
    EllipsisVertical,
    Layers3,
    GripVertical,
} from "lucide-react";
import { motion } from "motion/react";
import type { Company } from "../../Types/company";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
export interface Topic {
    id: number;
    label: string;
    slug: string;
    slides_count: number;
    folder: {
        id: number;
        slug: string;
        label: string;
    };
}

interface Props {
    topic: Topic;
    company: Company;
    onEdit: (topic: Topic) => void;
    onDelete: (topic: Topic) => void;
}

export default function TopicCard({ topic, company, onEdit, onDelete }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: topic.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn("relative", isDragging && "z-50")}
        >
            {" "}
            <motion.div
                ref={setNodeRef}
                style={style}
                initial={{
                    opacity: 0,
                    y: 12,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut",
                }}
                className={cn(
                    "group relative",
                    isDragging && "z-50 opacity-50",
                )}
            >
                <div className="relative h-full overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <div className="relative z-10 p-5">
                        {/* Main navigation */}
                        <Link
                            href={`/admin/folders/${company.slug}/${topic.folder.slug}/topics/${topic.slug}`}
                            className="
                            absolute
                            inset-0
                            z-0
                            rounded-xl
                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-ring
                            focus-visible:ring-offset-2
                        "
                            aria-label={`View topic ${topic.label}`}
                        />

                        {/* Header */}
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex min-w-0 items-center">
                                {/* Drag handle */}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "relative z-20 h-7 w-7 shrink-0 cursor-grab",
                                        "text-muted-foreground hover:bg-muted hover:text-foreground",
                                        isDragging && "cursor-grabbing",
                                    )}
                                    {...attributes}
                                    {...listeners}
                                >
                                    <GripVertical className="h-4 w-4" />
                                </Button>

                                {/* Topic information */}
                                <div className="ml-2 min-w-0">
                                    <h3 className="truncate text-base font-semibold tracking-tight">
                                        {topic.label}
                                    </h3>

                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                        {topic.folder.label}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="relative z-20 shrink-0">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="
                                            h-8 w-8
                                            text-muted-foreground
                                            opacity-60
                                            transition-opacity
                                            hover:bg-muted
                                            hover:text-foreground
                                            hover:opacity-100
                                            group-hover:opacity-100
                                        "
                                        >
                                            <EllipsisVertical className="h-4 w-4" />

                                            <span className="sr-only">
                                                Open menu
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="end"
                                        className="w-40"
                                    >
                                        <DropdownMenuItem
                                            onClick={() => onEdit(topic)}
                                            className="text-xs"
                                        >
                                            <Pencil className="mr-2 h-3.5 w-3.5" />
                                            Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem
                                            variant="destructive"
                                            className="text-xs"
                                            onClick={() => onDelete(topic)}
                                        >
                                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {/* Slide count */}
                        <div className="mt-6 flex items-center justify-between">
                            <div className="inline-flex items-center gap-1.5 rounded-md bg-muted/70 px-2 py-1">
                                <Layers3 className="h-3.5 w-3.5 text-muted-foreground" />

                                <span className="text-xs font-medium">
                                    {topic.slides_count}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                    {topic.slides_count === 1
                                        ? "slide"
                                        : "slides"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
