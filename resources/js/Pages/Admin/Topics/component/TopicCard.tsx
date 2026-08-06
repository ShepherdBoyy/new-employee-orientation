import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@inertiajs/react";
import { Pencil, Trash2, EllipsisVertical, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
    const [topic, setTopic] = useState({});

    // Handle empty state gracefully
    if (!topics || topics.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <FolderOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-foreground">
                    No topics found
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                    Get started by creating a new topic for this folder.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            {topics.map((item) => (
                <div key={item.id} className="relative group">
                    <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/55 bg-card">
                        <CardHeader className="flex flex-row items-center justify-between">
                            {/* Main clickable area wrapped safely */}
                            <Link
                                href={`/admin/folders/${company.slug}/${item.folder.slug}/topics/${item.slug}`}
                                className="absolute inset-0 z-0 focus:outline-none"
                                aria-label={`View topic ${item.label}`}
                            />

                            <div className="z-10 pointer-events-none">
                                <CardTitle className="text-sm font-medium">
                                    {item.label}
                                </CardTitle>
                                <CardDescription className="text-xs mt-0.5">
                                    {item.slides_count}{" "}
                                    {item.slides_count === 1
                                        ? "slide"
                                        : "slides"}
                                </CardDescription>
                            </div>

                            <CardHeader className="z-20">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        >
                                            <EllipsisVertical className="h-4 w-4" />
                                            <span className="sr-only">
                                                Open menu
                                            </span>
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="end"
                                        className="w-40 shadow-lg"
                                    >
                                        <DropdownMenuItem
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOpenEditDialog(true);
                                                setTopic({
                                                    id: item.id,
                                                    label: item.label,
                                                });
                                            }}
                                            className="text-xs"
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
                                                setOpenDeleteDialog(true);
                                                setTopic({
                                                    id: item.id,
                                                    label: item.label,
                                                });
                                            }}
                                        >
                                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                        </CardHeader>
                    </Card>
                </div>
            ))}
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
        </div>
    );
}
