import { useState } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Master from "@/Layout/Master";
import FolderIcon from "./component/FolderIcon";
import TopicList from "./component/TopicList";
import AddTopicDialog from "./component/Dialogs/AddTopicDialog";
import { Company } from "../Types/company";
import { Topic } from "./component/TopicCard";

const EMPLOYEE_TYPE_LABEL: Record<"field" | "non_field" | "both", string> = {
    field: "Field",
    non_field: "Non-Field",
    both: "Both",
};

interface Props {
    company: Company;
    topics: Topic[];
    activeFolder: {
        id: number;
        slug: string;
        name: string;
        employee_type: "field" | "non_field" | "both";
    };
}

function Index({ topics, company, activeFolder }: Props) {
    const [openAddDialog, setOpenAddDialog] = useState(false);

    return (
        <motion.div className="space-y-8" initial="hidden" animate="visible">
            <motion.header className="border-b pb-6">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex min-w-0 items-center gap-4">
                        <FolderIcon />

                        <div className="min-w-0">
                            <h1 className="truncate text-2xl font-semibold tracking-tight">
                                {activeFolder.name}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage the topics included in this module.
                            </p>
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="shrink-0"
                        onClick={() => setOpenAddDialog(true)}
                    >
                        <Plus className="size-4" />
                        Add Topic
                    </Button>
                </div>
            </motion.header>

            <TopicSection
                topics={topics}
                company={company}
                folderId={activeFolder.id}
            />

            <AddTopicDialog
                open={openAddDialog}
                onOpenChange={setOpenAddDialog}
                folderId={activeFolder.id}
            />
        </motion.div>
    );
}

function TopicSection({
    topics,
    company,
    folderId,
}: {
    topics: Topic[];
    company: Company;
    folderId: number;
}) {
    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">Topics</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage the content included in this module.
                    </p>
                </div>
                <span className="text-sm text-muted-foreground">
                    {topics.length} {topics.length === 1 ? "topic" : "topics"}
                </span>
            </div>

            <TopicList topics={topics} company={company} folderId={folderId} />
        </section>
    );
}

Index.layout = (page: React.ReactNode) => <Master>{page}</Master>;
export default Index;