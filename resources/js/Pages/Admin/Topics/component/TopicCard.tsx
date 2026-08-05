import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface Topics {
    id: number;
    label: string;
    slug: string;
    slides_count: number;
}

interface Props {
    topics: Topics[];
}

export default function TopicCard({ topics }: Props) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {topics.map((topic) => (
                <Card key={topic.id}>
                    <CardHeader>
                        <CardTitle>{topic.label}</CardTitle>
                        <CardDescription>
                            {topic.slides_count} slides
                        </CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </div>
    );
}
