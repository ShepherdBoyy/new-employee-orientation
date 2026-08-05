import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Link } from "@inertiajs/react";

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
    console.log(topics);
    return (
        <div className="grid grid-cols-2 gap-4">
            {topics.map((topic) => (
                <Link
                    key={topic.id}
                    href={`/admin/folders/${company.slug}/${topic.folder.slug}/topics/${topic.slug}`}
                >
                    <Card className="transition duration-300 hover:translate-x-1.5">
                        <CardHeader>
                            <CardTitle className="text-sm">
                                {topic.label}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {topic.slides_count} slides
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
