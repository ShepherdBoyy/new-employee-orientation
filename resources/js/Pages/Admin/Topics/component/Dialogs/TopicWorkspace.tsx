import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { Company } from "@/Pages/Admin/Types/company";
import type { Topic } from "../TopicCard";
import type { Folder } from "@/Pages/Admin/Slides/Index";
import TopicList from "../TopicList";
import AddTopicDialog from "@/Pages/Admin/Topics/component/Dialogs/AddTopicDialog";
import Master from "@/Layout/Master";
import FolderIcon from "../FolderIcon";
interface Props {
    company: Company;
    topics: Topic[];
    activeFolder: Folder;
}
export default function TopicWorkspace({
    topics,
    company,
    activeFolder,
}: {
    topics: Topic[];
    company: Company;
    activeFolder: Folder;
}) {
    const [openAddDialog, setOpenAddDialog] = useState(false);

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 12,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
    };
    return (
        <motion.section variants={itemVariants} className="space-y-4">
            <div className="flex items-end justify-between border-b pb-4">
                <div>
                    <h2 className="text-base font-semibold flex">
                        <FolderIcon />
                        {activeFolder.name}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage the content included in this module.
                    </p>
                </div>

                <Button size="sm" onClick={() => setOpenAddDialog(true)}>
                    <Plus />
                    Add Topic
                </Button>
            </div>

            <TopicList
                topics={topics}
                company={company}
                folderId={activeFolder.id}
            />

            <AddTopicDialog
                open={openAddDialog}
                onOpenChange={setOpenAddDialog}
                folderId={activeFolder.id}
            />
        </motion.section>
    );
}
