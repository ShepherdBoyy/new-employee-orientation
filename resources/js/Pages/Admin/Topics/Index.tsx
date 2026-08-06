import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Folder, Plus } from "lucide-react";

import AddTopicDialog from "@/Pages/Admin/Topics/component/Dialogs/AddTopicDialog";
import Master from "@/Layout/Master";
import TopicCard from "./component/TopicCard";

function Index({ topics, company }) {
    const [openAddDialog, setOpenAddDialog] = useState(false);
    return (
        <>
            <div className="mx-auto w-full space-y-6">
                <div className="border-b pb-5">
                    <h1 className="flex justify-between">
                        <div className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                            {topics[0].folder.name}
                        </div>
                        <div>
                            <Button
                                variant="outline"
                                onClick={() => setOpenAddDialog(true)}
                            >
                                <Plus />
                                Add Topic
                            </Button>
                        </div>
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Select a topic to manage its specific training content.
                    </p>
                </div>

                <TopicCard topics={topics} company={company} />

                <AddTopicDialog
                    open={openAddDialog}
                    onOpenChange={setOpenAddDialog}
                />
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <Master>{page}</Master>;

export default Index;
