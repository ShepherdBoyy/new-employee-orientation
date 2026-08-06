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
import { Pencil, Trash2, EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Company } from "../../Types/company";
import DeleteTopicDialog from "./Dialogs/DeleteTopicDialog";
import EditTopicDialog from "./Dialogs/EditTopicDialog";

interface Topics {
    id: number;
    label: string;
    slug: string;
    slides_count: number;
    folder: {
        id:number;
        slug:string;
        label:string
    }
}

interface Props {
    topics: Topics[];
    company: Company;
}

export default function TopicCard({ topics, company }: Props) {

    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [topic, setTopic] = useState({});
    
    return (
        <div className="grid grid-cols-2 gap-4">
            {topics.map((item) => (
                <>
                    <Link
                        key={item.id}
                        href={`/admin/folders/${company.slug}/${item.folder.slug}/topics/${item.slug}`}
                    >
                        <Card className="transition duration-300 hover:translate-x-1.5">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm">
                                        {item.label}
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        {item.slides_count} slides
                                    </CardDescription>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <EllipsisVertical className="h-3.5 w-3.5" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="end"
                                        className="w-40 shadow-lg"
                                    >
                                        <DropdownMenuItem 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenEditDialog(true)
                                            setTopic({
                                                id: item.id,
                                                label: item.label
                                            })
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
                                                    label: item.label
                                                })
                                            }}
                                        >
                                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                        </Card>
                    </Link>
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
            ))}
        </div>
    );
}
