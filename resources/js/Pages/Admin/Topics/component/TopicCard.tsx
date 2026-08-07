import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@inertiajs/react";
import {
    Pencil,
    Trash2,
    EllipsisVertical,
    FolderOpen,
    ArrowUpRight,
    Layers3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "motion/react";

import type { Company } from "../../Types/company";
import DeleteTopicDialog from "./Dialogs/DeleteTopicDialog";
import EditTopicDialog from "./Dialogs/EditTopicDialog";

interface Topic {
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
    topics: Topic[];
    company: Company;
}

export default function TopicCard({ topics, company }: Props) {
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [topic, setTopic] = useState<{
        id?: number;
        label?: string;
    }>({});

    if (!topics || topics.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="
                    flex min-h-56
                    flex-col items-center justify-center
                    rounded-xl
                    border border-dashed
                    bg-muted/20
                    p-8
                    text-center
                "
            >
                <div
                    className="
                        flex h-12 w-12
                        items-center justify-center
                        rounded-xl
                        border
                        bg-background
                        shadow-sm
                        p-2
                    "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        aria-label="topic partitions"
                        viewBox="0 0 214 134"
                    >
                        <path d="M18 8.2a30 30 0 0 0-5.4 5.1c-2.1 2.8-2.1 3.7-2.1 53.7 0 49.8 0 50.9 2.1 53.6 1.1 1.5 3.3 3.7 4.8 4.8 2.7 2.1 3.7 2.1 88.5 2.4l85.7.2 4.4-2.3c8.3-4.4 8-2.4 8-59.2 0-48.1-.1-50.1-2-53.3a18 18 0 0 0-5.2-5.2c-3.2-1.9-5.2-2-89.4-2H21.3zm178.6 5.2 3.4 3.4V43l-93 .2-93 .3V31.2c0-9 .4-13.1 1.5-15.2 3.2-6.2-1.1-5.9 92.4-6h85.3zm3.4 51.1V82h-91.4c-50.3 0-92.1.3-93 .6-1.4.5-1.6-1.4-1.6-17.7V46.5l93 .3 93 .2zm0 36.1c0 11-.4 15.2-1.5 17.4-3.2 6.3.8 6-91 6-92.8 0-88.7.3-91.9-6.5-1.2-2.5-1.6-6.7-1.6-17.7V85.5l93 .3 93 .2z"></path>
                        <path d="M35.9 21.2a8 8 0 0 0-3.8 3.5c-2.6 5.6 3.2 11.6 8.9 9.3 8.5-3.5 3.6-15.7-5.1-12.8m27 0c-3.7 1.3-5.5 5.8-3.7 9.4 2.7 5.7 10.2 5 13-1.2 1-2 .8-2.9-.8-5.1q-3.7-5-8.5-3.1M87 23c-2.7 2.7-2.5 6.6.5 9.5s5.4 3.1 8.9.4c3.2-2.5 3.6-7.7.8-10.2-2.5-2.3-7.8-2.1-10.2.3m25.1.6c-1.1 1.5-2.1 3-2.1 3.5 0 2.4 2.6 5.9 5.1 7 2.4.9 3.3.9 5.4-.5 1.4-1 3.1-2.8 3.7-4.2 1.7-3.6-1.6-7.8-6.4-8.2-2.9-.2-4 .2-5.7 2.4M34.2 60.7c-3.2 2.7-3.7 6.4-1.2 9.6A6.9 6.9 0 0 0 45.3 66c0-5.9-6.6-9.1-11.1-5.3m26.3.8c-3 3-3.1 5.4-.4 8.9a6 6 0 0 0 5.4 2.6c3.7 0 7.5-3.7 7.5-7.2 0-2.7-4.5-6.8-7.5-6.8a8 8 0 0 0-5 2.5m27 0c-3.1 3-3.2 6.5-.2 9.3C91.9 75.2 99 72.2 99 66c0-6.4-7-9.1-11.5-4.5m25 0c-3 3-3.1 5.4-.4 8.9 4 5.1 12.2 2.2 12.2-4.4 0-6.4-7.2-9.2-11.8-4.5M35.9 99.2c-3.6 1.2-5.6 6-4.1 9.4 2.6 5.5 10.3 5.7 12.7.2 2.6-6.3-2.3-11.7-8.6-9.6m26.5 0c-2.2 1-4.4 4.7-4.4 7.4 0 2.3 4.7 6.4 7.3 6.4 3.2 0 6.4-2.8 7.2-6.1 1.2-4.9-5.5-9.9-10.1-7.7m27.9-.4c-2.8.4-5.3 3.8-5.3 7 0 2.8 4.2 7.2 6.8 7.2 3.5 0 7.2-3.8 7.2-7.4 0-4.7-3.8-7.6-8.7-6.8m24.6.6c-3.6 1.8-5.3 5.5-4 8.9a6.9 6.9 0 0 0 12.6.7c3-5.9-2.8-12.5-8.6-9.6"></path>
                    </svg>
                </div>

                <h3 className="mt-4 text-sm font-semibold">No topics yet</h3>

                <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
                    Create a topic to start organizing the orientation content
                    for this folder.
                </p>
            </motion.div>
        );
    }

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2">
                {topics.map((item, index) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{
                            opacity: 0,
                            y: 12,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.96,
                            y: -8,
                        }}
                        transition={{
                            duration: 0.3,
                            delay: index * 0.05,
                            ease: "easeOut",
                        }}
                        className="group relative"
                    >
                        <div
                            className="
                                relative
                                h-full
                                overflow-hidden
                                rounded-xl
                                border
                                border-border/60
                                bg-card
                                transition-all
                                duration-200
                                hover:-translate-y-0.5
                                hover:border-primary/30
                                hover:shadow-lg
                                hover:shadow-primary/5
                            "
                        >
                            <div className="relative z-10 p-5">
                                {/* Main navigation */}
                                <Link
                                    href={`/admin/folders/${company.slug}/${item.folder.slug}/topics/${item.slug}`}
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
                                    aria-label={`View topic ${item.label}`}
                                />

                                {/* Header */}
                                <div className="flex items-start justify-between  gap-4">
                                    <div className="flex min-w-0 items-start gap-3">
                                        {/* Topic icon */}
                                        <div
                                            className="
                                                flex
                                                h-12 w-12
                                                shrink-0
                                                items-center justify-center
                                                rounded-lg
                                                bg-primary/10
                                                text-primary
                                                transition-colors
                                                duration-200
                                                group-hover:bg-primary/15
                                                p-2
                                            "
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                aria-label="projector 2"
                                                viewBox="0 0 203 93"
                                            >
                                                <path d="M18.5 5.4a16 16 0 0 0-8.5 9.7c-1.3 4.4-1.3 49.4 0 53.8 1.2 4.4 5.4 8.7 9.7 10.2 2.7.8 3.3 1.6 3.3 3.8 0 4.9 2.5 6.1 13.1 6.1S48 88.4 48 83.3V80h108v3.3c0 5.1 1.3 5.7 12 5.7s12-.6 12-5.4c0-2.7.7-3.4 5.2-5.6 8.6-4.2 8.8-4.9 8.8-36.6 0-26.5-.1-27.2-2.2-30.4a20 20 0 0 0-5.8-5.1c-3.3-1.8-7.5-1.9-84-1.9-64.8.1-81.1.3-83.5 1.4M184 9.5c5.8 3 6.1 4.9 5.8 33.5l-.3 26-3.3 3.2-3.2 3.3-78.8.3c-54 .2-79.9 0-82.4-.8-2.2-.6-4.6-2.3-6-4.3-2.2-3.1-2.3-4-2.6-27.3-.4-27.1.1-29.8 6-33.4 3.2-2 4.8-2 82.6-2 68.9 0 79.7.2 82.2 1.5m-140 73c0 2.6 0 2.6-8.2 2.3-7.7-.3-8.3-.5-8.6-2.6s-.1-2.2 8.2-2.2c8.5 0 8.6 0 8.6 2.5m132 0c0 2.5-.1 2.5-8 2.5s-8 0-8-2.5.1-2.5 8-2.5 8 0 8 2.5"></path>
                                                <path d="M127 11.9a31.7 31.7 0 0 0-12.4 52.4c5.1 5 9.9 7.4 16.8 8.5a31.1 31.1 0 0 0 33.7-44.3 32 32 0 0 0-16.8-15.9c-4.8-1.7-16.8-2-21.3-.7m20.5 5a26 26 0 0 1 16.2 22.4 26 26 0 0 1-13.2 26.2c-4.4 2.7-5.6 3-13.4 3-6.9 0-9.4-.5-12.6-2.2a27.3 27.3 0 0 1 1-48.9c6.3-3 16.1-3.2 22-.5"></path>
                                                <path d="M130 22.2c-11 3.1-17.3 17.1-12.6 28.1 5.6 13.3 23.8 16.7 34.2 6.3a20 20 0 0 0 0-29.2q-8.8-8.8-21.6-5.2m13.6 4.7a16 16 0 0 1 9.4 19c-3.2 12.1-17.5 16.8-26.7 8.8-8-7-8.6-17.5-1.4-24.3q8.6-8 18.7-3.5"></path>
                                                <path d="M126.9 33.1c-3.4 3.7-3.8 6.9-.9 6.9q1.8 0 2-1.2c0-.7 1.2-2.4 2.6-3.9 2.5-2.6 2.6-4.9.2-4.9-.5 0-2.3 1.4-3.9 3.1m-97.8-7.2q-1.2 1-.8 2.5c.6 1.5 2.9 1.6 19.4 1.4 18-.3 18.8-.4 18.8-2.3s-.7-2-18-2.2c-9.9-.2-18.6.1-19.4.6M28.5 37c-1.6 2.5 1.4 3 19.6 3S67 39.9 67 38s-.7-2-18.9-2c-11.6 0-19.2.4-19.6 1m0 10c-1.6 2.5 1.4 3 19.6 3S67 49.9 67 48s-.7-2-18.9-2c-11.6 0-19.2.4-19.6 1m0 10c-1.6 2.5 1.4 3 19.6 3S67 59.9 67 58s-.7-2-18.9-2c-11.6 0-19.2.4-19.6 1"></path>
                                            </svg>
                                        </div>

                                        {/* Topic information */}
                                        <div className="min-w-0 pt-2">
                                            <h3
                                                className="
                                                    truncate
                                                    text-base
                                                    font-semibold
                                                    tracking-tight
                                                "
                                            >
                                                {item.label}
                                            </h3>

                                            <p
                                                className="
                                                    mt-1
                                                    truncate
                                                    text-xs
                                                    text-muted-foreground
                                                "
                                            >
                                                {item.folder.label}
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
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        setTopic({
                                                            id: item.id,
                                                            label: item.label,
                                                        });

                                                        setOpenEditDialog(true);
                                                    }}
                                                    className="text-xs"
                                                >
                                                    <Pencil className="mr-2 h-3.5 w-3.5" />
                                                    Edit
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    className="text-xs"
                                                    onClick={(e) => {
                                                        e.stopPropagation();

                                                        setTopic({
                                                            id: item.id,
                                                            label: item.label,
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
                                    </div>
                                </div>

                                {/* Footer metadata */}
                                <div className="mt-6 flex items-center justify-between">
                                    <div
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1.5
                                            rounded-md
                                            bg-muted/70
                                            px-2
                                            py-1
                                        "
                                    >
                                        <Layers3 className="h-3.5 w-3.5 text-muted-foreground" />

                                        <span className="text-xs font-medium">
                                            {item.slides_count}
                                        </span>

                                        <span className="text-xs text-muted-foreground">
                                            {item.slides_count === 1
                                                ? "slide"
                                                : "slides"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <DeleteTopicDialog
                topic={topic}
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
            />

            <EditTopicDialog
                topic={topic}
                open={openEditDialog}
                onOpenChange={setOpenEditDialog}
            />
        </>
    );
}
