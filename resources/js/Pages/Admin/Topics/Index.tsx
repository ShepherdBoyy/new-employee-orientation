import Master from "@/Layout/Master";
import TopicCard from "./component/TopicCard";
import { Folder } from "lucide-react";
function Index({ topics, company }) {
    return (
        <>
            <div className="mx-auto w-full space-y-6 p-6 lg:p-8">
                <div className="border-b pb-5">
                    <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                        <Folder
                            absoluteStrokeWidth
                            strokeWidth={1.7}
                            className="h-6 w-6"
                        />{" "}
                        {topics[0].folder.name}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Select a topic to manage its specific training content.
                    </p>
                </div>

                <TopicCard topics={topics} company={company} />
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <Master>{page}</Master>;

export default Index;
