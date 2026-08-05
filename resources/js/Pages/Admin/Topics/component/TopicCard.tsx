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

interface Topics {
    id: number;
    label: string;
    slug: string;
    slides_count: number;
}

interface Props {
    topics: Topics[];
    company: [];
}

export default function TopicCard({ topics, company }: Props) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {topics.map((topic) => (
                <Link
                    key={topic.id}
                    href={`/admin/folders/${company.slug}/${topic.folder.slug}/topics/${topic.slug}`}
                >
                    <Card className="transition duration-300 hover:translate-x-1.5">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-sm">
                                    {topic.label}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    {topic.slides_count} slides
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
                                    <DropdownMenuItem className="text-xs">
                                        <Pencil className="mr-2 h-3.5 w-3.5" />
                                        Edit
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                        variant="destructive"
                                        className="text-xs text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
