import { useState } from "react";
import { Link } from "@inertiajs/react";
import { motion } from "motion/react";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Master from "@/Layout/Master";
import FolderIcon from "./component/FolderIcon";
import TopicList from "./component/TopicList";
import AddTopicDialog from "./component/Dialogs/AddTopicDialog";

interface Props {
    company: Company;
    topics: Topic[];
    activeFolder: {
        id: number;
        slug: string;
        name: string;
        is_type_specific: boolean;
        employee_type: "field" | "non_field" | null;
    };
    sibling: {
        id: number;
        slug: string;
        name: string;
        employee_type: "field" | "non_field";
        topics: Topic[];
    } | null;
}

function Index({ topics, company, activeFolder, sibling }: Props) {
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [activeType, setActiveType] = useState<"field" | "non_field">(
        activeFolder.employee_type ?? "field",
    );

    const isTypeSpecific = activeFolder.is_type_specific;

    const currentFolder =
        activeType === activeFolder.employee_type
            ? { id: activeFolder.id, topics }
            : sibling
              ? { id: sibling.id, topics: sibling.topics }
              : { id: activeFolder.id, topics };

    const title = isTypeSpecific ? "Module 5 — Job-Specific Training" : activeFolder.name;

    return (
        <motion.div className="space-y-8" initial="hidden" animate="visible">
            <motion.header className="border-b pb-6">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex min-w-0 items-center gap-4">
                        <FolderIcon jobSpecific={isTypeSpecific} />

                        <div className="min-w-0">
                            <h1 className="truncate text-2xl font-semibold tracking-tight">
                                {title}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage the topics included in this module.
                            </p>
                        </div>
                    </div>

                    <Button size="lg" className="shrink-0" onClick={() => setOpenAddDialog(true)}>
                        <Plus className="size-4" />
                        Add Topic
                    </Button>
                </div>
            </motion.header>

            {isTypeSpecific ? (
                <Tabs
                    value={activeType}
                    onValueChange={(value) => setActiveType(value as "field" | "non_field")}
                    className="w-full"
                >
                    <TabsList className="h-10 w-full">
                        <TabsTrigger value="field" className="gap-2">
                            Field-Based
                        </TabsTrigger>
                        <TabsTrigger value="non_field" className="gap-2">
                            Non-Field
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="field" className="mt-4 space-y-4">
                        <TopicSection
                            topics={activeType === "field" ? currentFolder.topics : []}
                            company={company}
                            folderId={currentFolder.id}
                        />
                    </TabsContent>

                    <TabsContent value="non_field" className="mt-4 space-y-4">
                        <TopicSection
                            topics={activeType === "non_field" ? currentFolder.topics : []}
                            company={company}
                            folderId={currentFolder.id}
                        />
                    </TabsContent>
                </Tabs>
            ) : (
                <TopicSection topics={topics} company={company} folderId={activeFolder.id} />
            )}

            <AddTopicDialog
                open={openAddDialog}
                onOpenChange={setOpenAddDialog}
                folderId={currentFolder.id}
            />
        </motion.div>
    );
}

function TopicSection({ topics, company, folderId }: { topics: Topic[]; company: Company; folderId: number }) {
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